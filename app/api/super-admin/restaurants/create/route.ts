import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

import { getCurrentUser }
from "@/lib/auth/getCurrentUser";

import { checkPermission }
from "@/lib/auth/checkPermission";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {

const headersList =
  await headers();

const authorization =
  headersList.get(
    "authorization"
  );

if (!authorization) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const token =
  authorization.replace(
    "Bearer ",
    ""
  );

const authUser =
  await getCurrentUser(
    token
  );

if (!authUser) {
  return NextResponse.json(
    {
      success: false,
      error: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}

const canCreateRestaurant =
  await checkPermission(
    authUser.id,
     "restaurant_new"
  );

if (
  !canCreateRestaurant
) {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );
}

    const body = await req.json();

    const {
      restaurant,
      user,
    } = body;

    /*
      CREAR RESTAURANTE
    */

    const { data: restaurantData, error: restaurantError } =
      await supabase
        .from("restaurants")
        .insert({
          ...restaurant,
          active: true,
          accepting_orders: true,
        })
        .select()
        .single();

    if (restaurantError) {
      throw restaurantError;
    }

    /*
      CREAR USUARIO ADMIN
    */

    const { error: userError } =
      await supabase
        .from("restaurant_users")
        .insert({
          restaurant_id:
            restaurantData.id,
          email: user.email,
          password_hash:
            user.password,
          role: "owner",
        });

    if (userError) {
      throw userError;
    }

    /*
      CREAR CONFIGURACIÓN INICIAL
    */

    await supabase
      .from(
        "restaurant_settings"
      )
      .insert({
        restaurant_id:
          restaurantData.id,

        hero_enabled: true,
        gallery_enabled: true,
        featured_menu_enabled: true,
        about_enabled: true,
        map_enabled: true,
        pickup_enabled: true,
        delivery_enabled: true,
        reviews_enabled: true,
        hours_enabled: true,
        services_enabled: true,

        whatsapp_enabled: true,
        floating_whatsapp_enabled: true,

        delivery_fee_enabled: true,

        theme_type: "modern",
      });

    return NextResponse.json({
      success: true,
      restaurant:
        restaurantData,
    });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}