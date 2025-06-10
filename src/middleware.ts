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

    // Remove the redirect for user role accessing dashboard
    // All authenticated users should be able to access dashboard
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

        // Allow access to public routes
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

        // Allow access to dashboard for all authenticated users
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }

        // Allow access to profile routes for authenticated users
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
