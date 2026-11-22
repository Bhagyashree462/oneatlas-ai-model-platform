
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Check Supabase authentication
  const { data, error } = await supabase.auth.getClaims();

  const isLoggedIn = !error && Boolean(data?.claims);

  // Temporary diagnostic logs
  console.log("ONEATLAS AUTH DEBUG:", {
    path: request.nextUrl.pathname,
    authenticated: isLoggedIn,
    error: error?.message,
  });

  const pathname = request.nextUrl.pathname;

  // Protect Playground routes
  const isPlayground =
    pathname === "/playground" ||
    pathname.startsWith("/playground/");

  if (isPlayground && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);

    const redirectResponse = NextResponse.redirect(loginUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  // Redirect logged-in users away from Login and Signup
  if (
    isLoggedIn &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    const redirectResponse = NextResponse.redirect(
      new URL("/playground", request.url)
    );

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
