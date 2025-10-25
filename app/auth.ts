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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        console.log("Profile during jwt creation");
        const googleId = profile.id || profile.sub;
        if (googleId) {
          token.userId = googleId;
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
      const uniqueId = profile?.id || profile?.sub; // Use the confirmed unique ID

      if (uniqueId) {
        await supabase.from("new_users").upsert({
          id: uniqueId,
          person_name: profile.name,
          person_email: profile.email,
        });
      }
      return true;
    },
  },
});
