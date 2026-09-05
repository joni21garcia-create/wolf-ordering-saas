import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { orderId, driverId } = await request.json();

    if (!orderId || !driverId) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .update({
        delivery_driver_id: driverId,
        status: "out_for_delivery",
        out_for_delivery_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .is("delivery_driver_id", null)
      .select(`
        *,
        restaurants (latitude, longitude, name, address)
      `)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: "Pedido no disponible" }, { status: 409 });

    return NextResponse.json({
      success: true,
      order: {
        ...data,
        restaurant: {
          lat: (data as any).restaurants?.latitude || 0,
          lng: (data as any).restaurants?.longitude || 0
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}