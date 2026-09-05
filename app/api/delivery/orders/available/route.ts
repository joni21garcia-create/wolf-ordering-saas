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

    // Usamos as any para evitar errores si TS aún no ve la columna
    query = (query as any).is("delivery_driver_id", null);

    if (zone) {
      query = query.eq("delivery_sector", zone);
    }

    const { data: orders, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}