import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendCustomer } from "@/lib/push";

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // 1. Validar Repartidor
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });

    const { data: driver } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id, active")
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();

    if (!driver || !driver.active) {
      return NextResponse.json({ success: false, error: "No tienes permiso de repartidor." }, { status: 403 });
    }

    const { orderId, status } = await request.json();

    // 2. Preparar actualización de tiempos
    const updateData: any = { status };
    if (status === "out_for_delivery") {
      updateData.out_for_delivery_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "paid"; // Marcar como pagado al finalizar
    }

    // 3. Ejecutar Update (Solo si el pedido le pertenece a este repartidor)
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId)
      .eq("delivery_driver_id", driver.id) // Seguridad: solo sus propios pedidos
      .select("id, tracking_code, order_type, customer_name")
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ success: false, error: "Pedido no encontrado o no asignado." }, { status: 404 });
    }

    // 4. Enviar Push al Cliente (Reusando tu lógica)
    if (status === "out_for_delivery") {
        await sendCustomer({
            orderId,
            title: "🛵 ¡Va en camino!",
            body: "Tu pedido salió del restaurante y va rumbo a ti.",
            url: `/tracking/${order.tracking_code}`,
            icon: "/icons/push/delivery.png"
        });
    } else if (status === "completed") {
        await sendCustomer({
            orderId,
            title: "🎉 ¡Pedido entregado!",
            body: "Esperamos que disfrutes tu comida. ¡Gracias!",
            url: `/tracking/${order.tracking_code}`,
            icon: "/icons/push/completed.png"
        });
    }

    return NextResponse.json({ success: true, status });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno." }, { status: 500 });
  }
}