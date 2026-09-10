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

    // CONSULTA CON CAST (as any) para evitar errores de compilación de TypeScript
    const { data: orders, error } = await (supabaseAdmin
      .from("orders")
      .select(`
        *,
        order_items (*, products (*)),
        restaurants (name, address, latitude, longitude, whatsapp_url, phone)
      `)
      .eq("order_type", "delivery")
      .in("status", ["pending", "accepted", "preparing", "ready", "out_for_delivery"]) as any);

    if (error) throw error;

    // Filtramos para que el repartidor vea solo lo libre o lo suyo
    const filteredOrders = (orders as any[])?.filter(o => 
      !o.delivery_driver_id || o.delivery_driver_id === driverId
    );

    const formattedOrders = filteredOrders?.map((order) => ({
      ...order,
      restaurant: {
        lat: order.restaurants?.latitude || -2.169,
        lng: order.restaurants?.longitude || -79.916
      }
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error: any) {
    console.error("[GET AVAILABLE ORDERS] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}