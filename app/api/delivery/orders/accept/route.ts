import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface OrderWithRestaurant {
  restaurants?: { latitude?: number; longitude?: number; name?: string; address?: string } | null;
  [key: string]: unknown;
}

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const { orderId, driverId } = await request.json();

    if (!orderId || !driverId) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    // El driverId debe pertenecer al usuario autenticado (no confiar en lo que manda el body)
    const { data: driverRow } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id")
      .eq("id", driverId)
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
    if (!driverRow) {
      return NextResponse.json({ success: false, error: "driverId no coincide con la sesión." }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({
        delivery_driver_id: driverId,
        accepted_at: new Date().toISOString()
      })
      .eq("id", orderId)
      .is("delivery_driver_id", null)
      .select(`
        *,
        restaurants (latitude, longitude, name, address)
      `)
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ success: false, error: "Pedido ya tomado por otro" }, { status: 409 });

    const typedData = data as OrderWithRestaurant;
    return NextResponse.json({
      success: true,
      order: {
        ...typedData,
        restaurant: {
          lat: typedData.restaurants?.latitude || 0,
          lng: typedData.restaurants?.longitude || 0
        }
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}