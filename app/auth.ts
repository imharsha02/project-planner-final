import { createClient } from "@supabase/supabase-js";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Token in session creation: ", token);
      if (token.userId) {
        session.user.id = String(token.userId);
      }
      return session;
    },
    async signIn({ account, profile }) {
      try {
        const uniqueId = profile?.id || profile?.sub;

        if (!uniqueId) {
          console.error("No unique ID found in profile:", profile);
          return false;
        }

        // Upsert user to database
        const { error } = await supabase.from("new_users").upsert(
          {
            id: uniqueId,
            person_name: profile?.name || null,
            person_email: profile?.email || null,
          },
          {
            onConflict: "id",
          }
        );

        if (error) {
          console.error("Error upserting user:", error);
          // Don't block sign-in if database operation fails
          // but log the error for debugging
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Return true to allow sign-in even if database operation fails
        return true;
      }
    },
  },
});
