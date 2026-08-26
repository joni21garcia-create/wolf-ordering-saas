import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { checkPermission } from "@/lib/auth/checkPermission";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestedRestaurantId = new URL(request.url)
      .searchParams.get("restaurantId")
      ?.trim();

    if (!requestedRestaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "restaurantId requerido",
        },
        { status: 400 }
      );
    }

    // El restaurante solicitado por la URL es la fuente de verdad.
    // Nunca usamos current_restaurant_id() aquí porque un usuario
    // puede tener acceso a más de un restaurante.
    const { data: isSuperAdmin, error: superAdminError } =
      await supabase.rpc("is_super_admin");

    if (superAdminError) {
      console.error("[GET ORDERS][SUPER ADMIN]", superAdminError);
      return NextResponse.json(
        {
          success: false,
          error: "Authorization check failed",
        },
        { status: 500 }
      );
    }

    if (!isSuperAdmin) {
      const { data: restaurantUser, error: restaurantError } =
        await supabase
          .from("restaurant_users")
          .select("restaurant_id, auth_user_id, active")
          .eq("auth_user_id", user.id)
          .eq("restaurant_id", requestedRestaurantId)
          .eq("active", true)
          .maybeSingle();

      if (restaurantError) {
        console.error("[GET ORDERS][RESTAURANT]", restaurantError);
        return NextResponse.json(
          {
            success: false,
            error: "Restaurant lookup failed",
          },
          { status: 500 }
        );
      }

      if (!restaurantUser) {
        return NextResponse.json(
          {
            success: false,
            error: "No tienes acceso a este restaurante",
          },
          { status: 403 }
        );
      }

      const hasPermission = await checkPermission(
        user.id,
        "orders"
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            success: false,
            error: "Forbidden",
          },
          { status: 403 }
        );
      }
    }

    const { data: deliverySettings, error: deliveryError } =
      await supabaseAdmin
        .from("restaurant_delivery_settings")
        .select("delivery_mode")
        .eq("restaurant_id", requestedRestaurantId)
        .maybeSingle();

    if (deliveryError) {
      console.error(
        "[GET ORDERS][DELIVERY SETTINGS]",
        deliveryError
      );

      return NextResponse.json(
        {
          success: false,
          error: deliveryError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: orders,
      error: ordersError,
    } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        restaurant_id,
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
      .eq("restaurant_id", requestedRestaurantId)
      .order("created_at", {
        ascending: false,
      });

    if (ordersError) {
      console.error("[GET ORDERS][ORDERS]", ordersError);

      return NextResponse.json(
        {
          success: false,
          error: ordersError.message,
        },
        { status: 500 }
      );
    }

    // Segunda barrera: incluso usando Service Role, devolvemos
    // exclusivamente órdenes cuyo restaurant_id coincide con la URL.
    const safeOrders = (orders ?? []).filter(
      (order) =>
        order.restaurant_id === requestedRestaurantId
    );

    return NextResponse.json({
      success: true,
      restaurantId: requestedRestaurantId,
      orders: safeOrders,
      deliveryMode:
        deliverySettings?.delivery_mode ?? "fixed",
    });
  } catch (error) {
    console.error("[GET ORDERS][UNHANDLED]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
