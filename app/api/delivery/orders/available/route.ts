import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const accessToken = authHeader.replace("Bearer ", "");
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const { data: driverRow } = await supabaseAdmin.from("delivery_drivers").select("id").eq("auth_user_id", userData.user.id).maybeSingle();
    const driverId = driverRow?.id;

    // CONSULTA MAESTRA: 
    // 1. Trae todos los estados (incluyendo 'pending')
    // 2. Trae todos los campos de tiempo (* en orders)
    // 3. Trae whatsapp_url y phone del restaurante
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (*, products (*)),
        restaurants (*) 
      `)
      .eq("order_type", "delivery")
      .in("status", ["pending", "accepted", "preparing", "ready", "out_for_delivery"]);

    if (error) throw error;

    // Mapeo seguro y filtro para que el repartidor vea solo lo libre o lo suyo
    const formattedOrders = orders?.filter(o => !o.delivery_driver_id || o.delivery_driver_id === driverId).map((order) => {
      const rest = (order.restaurants as any);
      return {
        ...order,
        restaurant: {
          lat: rest?.latitude || -2.169,
          lng: rest?.longitude || -79.916
        }
      };
    });

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error("[GET AVAILABLE ORDERS] Fatal Error:", error);
    return NextResponse.json({ success: false, error: "Falla en servidor: Revisa columnas en Supabase" }, { status: 500 });
  }
}