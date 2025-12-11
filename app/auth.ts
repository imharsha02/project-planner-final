import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { createServerSupabaseServiceClient } from "@/lib/supabase/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true, // Required for Vercel and other hosting platforms
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile, account }) {
      if (profile) {
        // Handle both Google and GitHub
        const uniqueId = profile.id || profile.sub;
        if (uniqueId) {
          token.userId = uniqueId;
        }
        // Store profile image in token
        if (profile.image) {
          token.image = profile.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Token in session creation: ", token);
      if (token.userId) {
        session.user.id = String(token.userId);
      }
      if (token.image) {
        session.user.image = String(token.image);
      }
      return session;
    },
    async signIn({ account, profile }) {
      // Validate that we have a unique identifier from the OAuth provider
      const uniqueId = profile?.id || profile?.sub;

      if (!uniqueId) {
        console.error("No unique ID found in profile:", profile);
        return false;
      }

      const email =
        profile?.email?.toLowerCase() ||
        (typeof profile?.email === "string"
          ? profile.email.toLowerCase()
          : null);

      if (!email) {
        console.error("No email found in OAuth profile:", profile);
        return false;
      }

      const username =
        (typeof profile?.name === "string" && profile.name.trim()) ||
        (typeof profile?.login === "string" && profile.login.trim()) ||
        email.split("@")[0];

      try {
        const supabase = createServerSupabaseServiceClient();

        const { data: existingUser, error: selectError } = await supabase
          .from("users")
          .select("id")
          .eq("user_email", email)
          .maybeSingle();

        if (selectError) {
          console.error(
            "Failed to query Supabase for existing user:",
            selectError
          );
          return false;
        }

        if (!existingUser) {
          const { error: insertError } = await supabase.from("users").insert({
            username,
            user_email: email,
          });

          if (insertError) {
            console.error("Failed to insert user into Supabase:", insertError);
            return false;
          }
        }
      } catch (error) {
        console.error(
          "Unexpected error ensuring user exists in Supabase:",
          error
        );
        return false;
      }

      return true;
    },
  },
});
