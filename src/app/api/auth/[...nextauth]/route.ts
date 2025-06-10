import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/auth";

declare module "next-auth" {
  interface Session {
  backendToken?: string;
  backendUser?: {
    id: string;
    email: string;
    name: string;
    role?: string;
    username?: string;
    isProfileComplete?: boolean;
  };
  isNewUser?: boolean;
  backendMessage?: string;
  isProfileComplete?: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}
  interface Account {
    backendToken?: string;
    backendUser?: {
      id: string;
      email: string;
      name: string;
      role?: string;
      username?: string;
      isProfileComplete?: boolean;
    };
    isNewUser?: boolean;
    backendMessage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
  backendToken?: string;
  backendUser?: {
    id: string;
    email: string;
    name: string;
    role?: string;
    username?: string;
    isProfileComplete?: boolean;
  };
  isNewUser?: boolean;
  backendMessage?: string;
  isProfileComplete?: boolean;
}
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
