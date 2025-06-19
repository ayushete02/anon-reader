import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {
    // Additional middleware logic can go here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const publicPaths = ["/", "/auth/error"];
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true;
        }

        // For protected routes, check if user has a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico).*)",
    // Always run for API routes
    "/api/(.*)",
  ],
};
