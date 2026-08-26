import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  const isPublicRoute =
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/api/manifest/manager" ||
    pathname.startsWith("/api/manifest/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/icons/");

  if (!isPublicRoute) {
    try {
      await supabase.auth.getUser();
    } catch (error) {
      console.error("[proxy] Auth refresh failed:", error);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icons|favicon.ico|manifest.json|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
