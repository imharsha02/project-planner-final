import { createClient } from "@supabase/supabase-js";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { randomUUID } from "crypto";

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
        // Note: id is int8 (auto-increment), so we don't set it
        // user_id stores the OAuth provider's unique identifier
        // uid is a UUID for the user (only generate if new user)
        const userId = String(uniqueId);

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from("new_users")
          .select("uid")
          .eq("user_id", userId)
          .single();

        // Prepare upsert data
        const upsertData: {
          user_id: string;
          e: string | null;
          person_email: string | null;
          uid?: string;
        } = {
          user_id: userId,
          e: profile?.name || null,
          person_email: profile?.email || null,
        };

        // Only set uid if user doesn't exist
        if (!existingUser) {
          upsertData.uid = randomUUID();
        }

        const { error } = await supabase.from("new_users").upsert(upsertData, {
          onConflict: "user_id",
        });

        if (error) {
          console.error("Error upserting user:", error);
          // Don't block sign-in if database operation fails
          // but log the error for debugging
        }
        console.log("User upserted successfully");
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        // Return true to allow sign-in even if database operation fails
        return true;
      }
    },
  },
});
