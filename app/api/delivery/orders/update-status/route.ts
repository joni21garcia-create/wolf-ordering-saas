import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

// Estados que el repartidor tiene permitido setear desde la app.
// "accepted"/"preparing"/"ready" los controla el restaurante; el repartidor
// solo avanza el tramo real: en camino -> entregado.
const DRIVER_ALLOWED_STATUSES = ["out_for_delivery", "completed"];

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
    const { data: driver } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
    if (!driver) {
      return NextResponse.json({ success: false, error: "Repartidor no encontrado." }, { status: 403 });
    }

    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    if (!DRIVER_ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json({ success: false, error: "Estado no permitido para repartidor" }, { status: 400 });
    }

    // Nota: los tipos generados de Supabase (database.types.ts) están
    // desactualizados y no incluyen todas las columnas reales de "orders"
    // (ej. updated_at), por eso se usa 'any' aquí explícitamente.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "out_for_delivery") {
      updateData.out_for_delivery_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "paid";
    }

    // Solo puede tocar un pedido que sea suyo, y no reabrir uno ya entregado.
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
      return NextResponse.json({ success: false, error: "Pedido no asignado a este repartidor o ya finalizado" }, { status: 409 });
    }

    // --- AVISO AL CLIENTE ---
    try {
      const { sendCustomer } = await import("@/lib/push");
      const messages: Record<string, { title: string; body: string }> = {
        out_for_delivery: {
          title: "🛵 ¡Va en camino!",
          body: "Tu pedido salió del restaurante y va rumbo a ti.",
        },
        completed: {
          title: "🎉 ¡Pedido entregado!",
          body: "Esperamos que disfrutes tu comida. ¡Gracias por elegirnos!",
        },
      };
      const msg = messages[status];
      if (msg) {
        await sendCustomer({
          orderId,
          title: msg.title,
          body: msg.body,
          url: `/tracking/${updated.tracking_code}`,
          icon: status === "completed" ? "/icons/push/completed.png" : "/icons/push/delivery.png",
          badge: "/icons/badge/wolf.png",
        });
      }
    } catch (err) {
      console.error("[PUSH ERROR][CUSTOMER]", err);
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("[UPDATE STATUS FATAL]", error);
    const message = error instanceof Error ? error.message : "Error interno";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}