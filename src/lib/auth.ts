import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email atau Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("NextAuth CredentialsProvider authorize called with:", {
          identifier: credentials?.identifier,
          password: credentials?.password ? "***" : "empty"
        });

        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Email/username dan password wajib diisi");
        }

        try {
          
          const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
          console.log("Calling backend URL:", backendUrl);
          
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
          });

          const result = await response.json();
          console.log("Backend response:", {
            status: response.status,
            ok: response.ok,
            result: result
          });

          if (response.ok && result.status === "success" && result.data) {
            
            const userObject = {
              id: result.data.account.id.toString(),
              email: result.data.account.email,
              name: result.data.account.fullName || result.data.account.username,
              role: result.data.account.role,
              backendToken: result.data.token,
              isProfileComplete: result.data.account.isProfileComplete,
              backendUser: result.data.account,
            };
            console.log("Returning user object:", userObject);
            return userObject;
          } else {
            
            if (result?.error?.code === "GOOGLE_AUTH_REQUIRED") {
              throw new Error("Akun ini terdaftar melalui Google. Silakan gunakan tombol 'Masuk dengan Google'.");
            }
            if (result?.status === "unverified") {
              throw new Error("EMAIL_UNVERIFIED:" + JSON.stringify({
                email: result.data?.email,
                userId: result.data?.userId
              }));
            }
            throw new Error(result?.message || "Login gagal");
          }
        } catch (error) {
          console.error("Credentials login error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, user }) {
      console.log("SignIn callback triggered for provider:", account?.provider);
      console.log("User data:", user);

      if (account?.provider === "google") {
        try {
          
          const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
          console.log("Calling backend URL:", backendUrl);

          const response = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleToken: account.id_token,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("Backend response:", result);
            if (result.status === "success" && result.data) {
              
              account.backendToken = result.data.token;
              account.backendUser = result.data.account;
              account.isNewUser = result.data.isNewUser;
              account.backendMessage = result.message;
              console.log(
                "Google sign-in successful with backend integration for:",
                user.email
              );
              return true;
            } else {
              console.error("Backend auth failed:", result.message);
              return false;
            }
          } else {
            console.error(
              "Backend request failed with status:",
              response.status
            );
            return false;
          }
        } catch (error) {
          console.error("Error during backend authentication:", error);
          
          return false;
        }
      }
      
      
      if (account?.provider === "credentials") {
        return true;
      }
      
      return true;
    },
    async jwt({ token, account, user }) {
      
      if (account?.backendToken) {
        token.backendToken = account.backendToken;
        token.backendUser = account.backendUser;
        token.isNewUser = account.isNewUser;
        token.backendMessage = account.backendMessage;
      }
        
      if (account?.provider === "credentials" && user) {
        const credentialsUser = user as {
          backendToken?: string;
          backendUser?: {
            id: string;
            email: string;
            name: string;
            role?: string;
            username?: string;
          };
          isProfileComplete?: boolean;
        };
        token.backendToken = credentialsUser.backendToken;
        token.backendUser = credentialsUser.backendUser;
        token.isNewUser = false; 
        token.isProfileComplete = credentialsUser.isProfileComplete;
      }
      
      return token;
    },
    async session({ session, token }) {
      
      session.backendToken = token.backendToken as string;
      session.backendUser = token.backendUser;
      session.isNewUser = token.isNewUser;
      session.backendMessage = token.backendMessage;
      
      
      if (session.user && token.backendUser?.role) {
        session.user.role = token.backendUser.role;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", 
    error: "/auth/error", 
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },

  
  debug: process.env.NODE_ENV === "development",

  
  useSecureCookies: process.env.NODE_ENV === "production",
  
  events: {
    async signIn({ user, account }) {
      console.log("User signed in:", {
        user: user.email,
        provider: account?.provider,
      });
    },
    async signOut({ session }) {
      console.log("User signed out:", session?.user?.email);
    },
  },
};
