import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Correo y contraseña son requeridos." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas." },
        { status: 401 },
      );
    }

    const db = supabaseAdmin as any;
    const { data: driver, error: driverError } = await db
      .from("delivery_drivers")
      .select("id, auth_user_id, full_name, phone, active, online, zone")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();

    if (driverError) {
      console.error("[DELIVERY LOGIN][DRIVER]", driverError);
      return NextResponse.json(
        { success: false, error: "No fue posible validar el perfil de repartidor." },
        { status: 500 },
      );
    }

    if (!driver || !driver.active) {
      return NextResponse.json(
        { success: false, error: "Esta cuenta no está habilitada como repartidor." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      success: true,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      userId: data.user.id,
      driver,
    });
  } catch (error) {
    console.error("[DELIVERY LOGIN]", error);
    return NextResponse.json(
      { success: false, error: "Error interno de autenticación." },
      { status: 500 },
    );
  }
}
