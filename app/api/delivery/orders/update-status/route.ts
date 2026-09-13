import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

const DRIVER_ALLOWED_STATUSES = ["out_for_delivery", "completed"];

export async function POST(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const { data: driver } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (!driver) {
      return NextResponse.json({ success: false, error: "Repartidor no encontrado." }, { status: 403 });
    }

    const body = await request.json();
    const { 
      orderId, 
      status, 
      evidenceUrl, 
      feePayer, 
      driverEarning, 
      deliveryDuration,
      customerPhone 
    } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    if (!DRIVER_ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Estado no permitido" }, { status: 400 });
    }

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // --- AUDITORÍA V30: Registro de Billetera y Evidencia ---
    if (status === "out_for_delivery") {
      updateData.out_for_delivery_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "paid";
      
      // Guardamos la info financiera y operativa
      updateData.evidence_url = evidenceUrl;
      updateData.fee_payer = feePayer;
      updateData.driver_earning = driverEarning;
      updateData.delivery_duration = deliveryDuration;
      if (customerPhone) updateData.customer_phone = customerPhone;
    }

    const { data: updated, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .eq("delivery_driver_id", driver.id)
      .neq("status", "completed")
      .select("id, tracking_code")
      .maybeSingle();

    if (error) throw error;
    if (!updated) {
      return NextResponse.json({ success: false, error: "No asignado o ya finalizado" }, { status: 409 });
    }

    // --- AVISO AL CLIENTE (PUSH) ---
    try {
      const { sendCustomer } = await import("@/lib/push");
      const messages: Record<string, { title: string; body: string }> = {
        out_for_delivery: { title: "🛵 ¡Va en camino!", body: "Tu pedido va rumbo a ti." },
        completed: { title: "🎉 ¡Pedido entregado!", body: "¡Gracias por elegir Wolf!" },
      };
      const msg = messages[status];
      if (msg) {
        await sendCustomer({
          orderId,
          title: msg.title,
          body: msg.body,
          url: `/tracking/${updated.tracking_code}`,
          icon: status === "completed" ? "/icons/push/completed.png" : "/icons/push/delivery.png",
        });
      }
    } catch (err) { console.error("[PUSH ERROR]", err); }

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}