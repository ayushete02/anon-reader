import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import type { Account, Profile, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Force Node.js runtime for NextAuth
export const runtime = "nodejs";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
      profile,
    }: {
      token: JWT;
      account: Account | null;
      profile?: Profile;
    }) {
      // Persist the OAuth access_token and user profile to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.profile = { ...profile };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.profile = token.profile;

      // Ensure user has an id
      if (session.user && !session.user.id) {
        session.user.id = session.user.email || "";
      }

      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
