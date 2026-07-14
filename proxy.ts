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

  // Sincroniza la sesión entre navegador y SSR (Mantenido intacto)
  await supabase.auth.getUser();

  return response;
}

export const config = {
  /* 
   * Modificado exclusivamente para incluir:
   * - manifest.json y manifest.webmanifest
   * - La carpeta /icons de forma explícita
   */
  matcher: [
    "/((?!_next/static|_next/image|icons|favicon.ico|manifest.json|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};