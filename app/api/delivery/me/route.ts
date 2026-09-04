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
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const db = supabaseAdmin as any;
    const { data: driver, error } = await db
      .from("delivery_drivers")
      .select("id, auth_user_id, full_name, phone, active, online, zone")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();

    if (error) {
      console.error("[DELIVERY ME]", error);
      return NextResponse.json({ success: false, error: "No fue posible obtener el repartidor." }, { status: 500 });
    }

    if (!driver || !driver.active) {
      return NextResponse.json({ success: false, error: "Repartidor no habilitado." }, { status: 403 });
    }

    return NextResponse.json({ success: true, driver });
  } catch (error) {
    console.error("[DELIVERY ME][UNHANDLED]", error);
    return NextResponse.json({ success: false, error: "Error interno." }, { status: 500 });
  }
}
