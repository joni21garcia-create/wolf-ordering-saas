import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (!user) return NextResponse.json({ success: false, error: "Sesión inválida" }, { status: 401 });

    const { data: driver } = await supabaseAdmin.from("delivery_drivers").select("id").eq("auth_user_id", user.id).maybeSingle();
    if (!driver) return NextResponse.json({ success: false, error: "No habilitado" }, { status: 403 });

    // Seleccionamos TODO (*) de la orden para traer fee_payer, driver_earning, duration y evidence_url
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*, restaurants(*)") 
      .eq("delivery_driver_id", driver.id)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}