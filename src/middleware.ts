import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    console.log("Middleware executing:", {
      pathname,
      hasToken: !!token,
      userRole: token?.backendUser?.role,
      email: token?.email,
    });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        console.log("Authorization check:", {
          pathname,
          hasToken: !!token,
          userRole: token?.backendUser?.role,
        });

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
          if (pathname.startsWith("/dashboard/users")) {
            // Users page requires admin role
            return !!token && token.backendUser?.role === "admin";
          }
          // Other dashboard pages just require authentication
          return !!token;
        }

        if (
          pathname.startsWith("/profile") ||
          pathname.startsWith("/settings")
        ) {
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
