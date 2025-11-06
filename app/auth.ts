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

        // Insert user to database
        // Note: id is int8 (auto-increment), so we don't set it
        // user_id stores the OAuth provider's unique identifier
        // uid is a UUID for the user
        const userId = String(uniqueId);

        // Prepare insert data
        const insertData: {
          user_id: string;
          e: string | null;
          person_email: string | null;
          uid: string;
        } = {
          user_id: userId,
          e: profile?.name || null,
          person_email: profile?.email || null,
          uid: randomUUID(),
        };

        console.log("Attempting to insert user:", {
          user_id: insertData.user_id,
          e: insertData.e,
          person_email: insertData.person_email,
          uid: insertData.uid,
        });

        const { data: insertResult, error } = await supabase
          .from("new_users")
          .insert(insertData)
          .select();

        if (error) {
          console.error("Error inserting user:", error);
          console.error("Error details:", {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          // Don't block sign-in if database operation fails
          // but log the error for debugging
        } else {
          console.log("User inserted successfully:", insertResult);
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
