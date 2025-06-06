import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/auth") ||
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/reset-password" ||
          pathname === "/"
        ) {
          return true;
        }        
        if (pathname.startsWith("/dashboard")) {
          
          return !!token;
        }

        
        if (pathname.startsWith("/profile")) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\..*|api/(?!auth)).*)",
  ],
};
