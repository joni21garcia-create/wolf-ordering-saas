import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { registerAndroidServer } from "@/lib/push/registerAndroidServer";

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
        {
          success: false,
          error: "Token requerido",
        },
        {
          status: 400,
        }
      );

    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      return NextResponse.json(
        {
          success: false,
          error: "No autenticado",
        },
        {
          status: 401,
        }
      );

    }

    const { data: restaurantUser } = await supabase
      .from("restaurant_users")
      .select("restaurant_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!restaurantUser) {

      return NextResponse.json(
        {
          success: false,
          error: "Restaurante no encontrado",
        },
        {
          status: 404,
        }
      );

    }

    const result = await registerAndroidServer({
      restaurantId: restaurantUser.restaurant_id,
      userId: user.id,
      token,
      platform,
    });

    if (!result.success) {

      return NextResponse.json(
        {
          success: false,
          error: "No fue posible registrar el dispositivo",
        },
        {
          status: 500,
        }
      );

    }

    return NextResponse.json({
      success: true,
      subscription_id: result.subscriptionId,
    });

  } catch (error) {

    console.error("[REGISTER DEVICE]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno",
      },
      {
        status: 500,
      }
    );

  }

}