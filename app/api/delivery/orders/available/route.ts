import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone");

    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (*)
        ),
        restaurants (
          name,
          address,
          latitude,
          longitude
        )
      `)
      .eq("status", "ready");

    query = (query as any).is("delivery_driver_id", null);

    if (zone) {
      query = query.eq("delivery_sector", zone);
    }

    const { data: orders, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    // Transformamos la respuesta para que Android reciba las coordenadas como GeoPoint
    const formattedOrders = orders?.map(order => ({
      ...order,
      restaurant: {
        lat: order.restaurants?.latitude || 0,
        lng: order.restaurants?.longitude || 0
      }
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}