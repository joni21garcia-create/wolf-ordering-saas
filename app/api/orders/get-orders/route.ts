import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkPermission } from "@/lib/auth/checkPermission";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // Validar sesión SSR
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[AUTH]", authError);

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

    // Obtener restaurante del usuario autenticado
    const {
      data: restaurantUser,
      error: restaurantError,
    } = await supabase
      .from("restaurant_users")
      .select(`
        restaurant_id,
        auth_user_id,
        role_id
      `)
      .eq("auth_user_id", user.id)
      .maybeSingle();

      if (!restaurantUser?.restaurant_id) {
  return NextResponse.json(
    {
      success: false,
      error: "Restaurant not assigned",
    },
    {
      status: 403,
    }
  );
}

    if (restaurantError) {
      console.error("[RESTAURANT]", restaurantError);

      return NextResponse.json(
        {
          success: false,
          error: "Restaurant lookup failed",
        },
        {
          status: 500,
        }
      );
    }

    if (!restaurantUser) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not assigned",
        },
        {
          status: 403,
        }
      );
    }

    // Validar permisos
    const hasPermission = await checkPermission(
      restaurantUser.auth_user_id,
      "orders"
    );

    if (!hasPermission) {
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

    const { data: deliverySettings } =
  await supabaseAdmin
    .from("restaurant_delivery_settings")
    .select("delivery_mode")
    .eq(
      "restaurant_id",
      restaurantUser.restaurant_id
    )
    .maybeSingle();

    // Consultar órdenes con Service Role
    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
.select(`
  id,
  tracking_code,
  customer_name,
  customer_phone,
  order_type,
  subtotal,
  delivery_fee,
  total,
  commission_amount,
  restaurant_amount,
  wolf_amount,
  payment_method,
  payment_status,
  status,
  created_at,
  order_items (
    id,
    quantity,
    unit_price,
    subtotal,
    products (
      id,
      name
    )
  )
`)
      .eq("restaurant_id", restaurantUser.restaurant_id)
      .order("created_at", {
        ascending: false,
      });

    if (ordersError) {
      console.error("[ORDERS]", ordersError);

      return NextResponse.json(
        {
          success: false,
          error: ordersError.message,
        },
        {
          status: 500,
        }
      );
    }

return NextResponse.json({
  success: true,
  orders: orders ?? [],
  deliveryMode:
    deliverySettings?.delivery_mode ?? "fixed",
});
  } catch (error) {
    console.error("[GET ORDERS]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}


