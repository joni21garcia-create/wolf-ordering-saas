import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !user) return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });

    const { data: driver, error } = await supabaseAdmin
      .from("delivery_drivers")
      .select(`
        id, 
        auth_user_id, 
        full_name, 
        email, 
        phone, 
        active, 
        online, 
        zone, 
        restaurant_id,
        vehicle_type,
        license_plate,
        vehicle_color,
        ranking_level,
        rating,
        total_deliveries, -- Dato vital para el ranking
        selfie_url,
        doc_front_url,
        doc_back_url,
        type -- Para Staff vs Asociado
      `)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (error) throw error;
    if (!driver) return NextResponse.json({ success: false, error: "Repartidor no encontrado" }, { status: 404 });

    return NextResponse.json({ success: true, driver });
    
  } catch (error: any) {
    console.error("[ME API ERROR]", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}