import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  let response = NextResponse.redirect(`${origin}/login`);

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

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("AUTH CALLBACK:", error);

    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: restaurantUser } = await supabase
    .from("restaurant_users")
    .select(`
      restaurant_id,
      auth_user_id,
      restaurant_roles (
        code
      )
    `)
    .eq("email", user.email!)
    .maybeSingle();

  if (!restaurantUser) {
    return NextResponse.redirect(`${origin}/login?error=no-access`);
  }

  if (restaurantUser.auth_user_id !== user.id) {
    await supabase
      .from("restaurant_users")
      .update({
        auth_user_id: user.id,
      })
      .eq("email", user.email!);
  }

  const role =
    (restaurantUser.restaurant_roles as any)?.code;

  if (role === "super-user" || role === "owner") {
    response = NextResponse.redirect(`${origin}/super-admin`);
  } else {
    response = NextResponse.redirect(
      `${origin}/super-admin/restaurants/${restaurantUser.restaurant_id}/restaurante/dashboard`
    );
  }

  return response;
}