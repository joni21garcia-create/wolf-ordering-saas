import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (!user) return NextResponse.json({ success: false, error: "Sesión inválida" }, { status: 401 });

    const { data: driverRow } = await supabaseAdmin.from("delivery_drivers").select("id").eq("auth_user_id", user.id).maybeSingle();
    const driverId = driverRow?.id;

    // CONSULTA MAESTRA: Trae todo (Efectivo, QR, Transferencia) y todos los tiempos
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (*, products (*)),
        restaurants (name, address, latitude, longitude, whatsapp_url, phone)
      `)
      .eq("order_type", "delivery")
      .in("status", ["pending", "accepted", "preparing", "ready", "out_for_delivery"]);

    if (error) throw error;

    // Filtramos manualmente para asegurar visibilidad total (míos + libres)
    const formattedOrders = orders?.filter(o => !o.delivery_driver_id || o.delivery_driver_id === driverId).map((order) => ({
      ...order,
      restaurant: {
        lat: order.restaurants?.latitude || -2.169,
        lng: order.restaurants?.longitude || -79.916
      }
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error("[BACKEND ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}