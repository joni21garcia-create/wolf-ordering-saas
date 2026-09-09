import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Datos faltantes" }, { status: 400 });
    }

    const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
    };

    // ALINEACIÓN DE TIEMPOS Y DISPARADORES
    switch (status) {
      case "accepted":
        updateData.accepted_at = new Date().toISOString();
        
        // --- REPIQUE PERSISTENTE PARA NEGOCIACIÓN ---
        try {
          const { sendToDrivers } = await import("@/lib/push");
          await sendToDrivers({
            title: "🤝 ¡Nueva Negociación!",
            body: "Un restaurante aceptó un pedido. ¡Entra para negociar el envío!",
            data: {
              type: "NEW_ORDER", // Esto hace que la App suene
              orderId: orderId,
              status: "accepted"
            },
          });
        } catch (err) {
          console.error("[PUSH ERROR]", err);
        }
        break;

      case "preparing":
        updateData.preparing_at = new Date().toISOString();
        break;

      case "ready":
        updateData.ready_at = new Date().toISOString();
        // Opcional: Notificar de nuevo que está listo si no hay repartidor
        break;

      case "out_for_delivery":
        updateData.out_for_delivery_at = new Date().toISOString();
        break;

      case "completed":
        updateData.completed_at = new Date().toISOString();
        updateData.payment_status = "paid";
        break;
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error("[UPDATE STATUS FATAL]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}