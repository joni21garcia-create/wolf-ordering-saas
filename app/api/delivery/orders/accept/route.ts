import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { orderId, driverId } = await request.json();

    if (!orderId || !driverId) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    // Forzamos as any en el update para aceptar las nuevas columnas
    const { data, error } = await (supabaseAdmin
      .from("orders") as any)
      .update({
        delivery_driver_id: driverId,
        status: "out_for_delivery",
        out_for_delivery_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .is("delivery_driver_id", null)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: "Pedido no disponible" }, { status: 409 });

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}