import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface OrderWithRestaurant {
  restaurants?: { 
    latitude?: number; 
    longitude?: number;
    name?: string;
    address?: string;
    whatsapp_url?: string;
    phone?: string;
  } | null;
  [key: string]: unknown;
}

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const { data: driverRow } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
    const driverId = driverRow?.id;

    const { searchParams } = new URL(request.url);
    const zone = searchParams.get("zone");

    // Libres para negociar (accepted/ready sin repartidor) + el pedido propio
    // en cualquier estado activo (preparing/ready/out_for_delivery), para que
    // el repartidor siga viendo su misión avanzar hasta "entregado".
    let query = supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (*, products (*)),
        restaurants (name, address, latitude, longitude, whatsapp_url, phone)
      `)
      .eq("order_type", "delivery")
      .in("status", ["accepted", "preparing", "ready", "out_for_delivery"]);

    if (driverId) {
      query = query.or(`delivery_driver_id.is.null,delivery_driver_id.eq.${driverId}`);
    } else {
      query = query.is("delivery_driver_id", null);
    }

    if (zone) query = query.eq("delivery_sector", zone);

    const { data: orders, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    const formattedOrders = (orders as OrderWithRestaurant[] | null)?.map((order) => ({
      ...order,
      restaurant: {
        lat: order.restaurants?.latitude || -2.169,
        lng: order.restaurants?.longitude || -79.916
      }
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}