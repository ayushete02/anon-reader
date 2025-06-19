import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    profile?: {
      sub?: string;
      name?: string;
      email?: string;
      picture?: string;
      [key: string]: unknown;
    };
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    profile?: {
      sub?: string;
      name?: string;
      email?: string;
      picture?: string;
      [key: string]: unknown;
    };
  }
}
