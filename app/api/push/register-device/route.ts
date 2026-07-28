import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const response = NextResponse.next();

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

  try {
    const { token, platform = "android" } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token FCM obligatorio" },
        { status: 400 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    const { data: restaurantUser, error: restaurantError } =
      await supabase
        .from("restaurant_users")
        .select("restaurant_id")
        .eq("auth_user_id", user.id)
        .single();

    if (restaurantError || !restaurantUser) {
      return NextResponse.json(
        { error: "No se encontró el restaurante del usuario" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("device_tokens")
      .upsert(
        {
          restaurant_id: restaurantUser.restaurant_id,
          user_id: user.id,
          fcm_token: token,
          platform,
          active: true,
        },
        {
          onConflict: "fcm_token",
        }
      );

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}