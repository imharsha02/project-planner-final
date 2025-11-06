import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

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
      // Validate that we have a unique identifier from the OAuth provider
      const uniqueId = profile?.id || profile?.sub;

      if (!uniqueId) {
        console.error("No unique ID found in profile:", profile);
        return false;
      }

      return true;
    },
  },
});
