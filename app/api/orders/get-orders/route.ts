import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    // 1. Validar sesión SSR
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[GET ORDERS][AUTH]", authError);

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // 2. Arquitectura nueva:
    //    el restaurante se obtiene desde la función centralizada
    //    current_restaurant_id(), que respeta active = true.
    const { data: restaurantId, error: restaurantIdError } =
      await supabase.rpc("current_restaurant_id");

    if (restaurantIdError) {
      console.error(
        "[GET ORDERS][RESTAURANT ID]",
        restaurantIdError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Restaurant lookup failed",
        },
        { status: 500 }
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not assigned",
        },
        { status: 403 }
      );
    }

    // 3. Arquitectura nueva de permisos.
    //    can_view_orders() es la fuente única de autorización.
    const { data: canViewOrders, error: permissionError } =
      await supabase.rpc("can_view_orders");

    if (permissionError) {
      console.error(
        "[GET ORDERS][PERMISSION]",
        permissionError
      );

      return NextResponse.json(
        {
          success: false,
          error: "Permission check failed",
        },
        { status: 500 }
      );
    }

    if (!canViewOrders) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    // 4. Configuración de delivery del restaurante actual.
    const { data: deliverySettings, error: deliveryError } =
      await supabaseAdmin
        .from("restaurant_delivery_settings")
        .select("delivery_mode")
        .eq("restaurant_id", restaurantId)
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

    // 5. Obtener únicamente las órdenes del restaurante autenticado.
    //    Service Role se usa aquí solamente para la lectura controlada.
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
      .eq("restaurant_id", restaurantId)
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

    return NextResponse.json({
      success: true,
      orders: orders ?? [],
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