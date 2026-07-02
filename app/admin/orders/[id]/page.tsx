import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props { params: Promise<{ id: string }>; }

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const { data: order } = await supabase
    .from("orders")
    .select(`*, order_items (*, products (id, name))`)
    .eq("id", id)
    .maybeSingle();

  if (!order) return <main style={{ minHeight: "100vh", background: "#050505", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>Pedido no encontrado</main>;

  const statusColor = order.status === "completed" ? "#22c55e" : order.status === "cancelled" ? "#ef4444" : "#f97316";
  const paymentColor = order.payment_status === "paid" ? "#22c55e" : "#facc15";

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#050505,#0b0b0b)", padding: "20px" }}>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "35px" }}>
          <div>
            <div style={{ color: "#777", textTransform: "uppercase", letterSpacing: "2px" }}>Pedido</div>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 58px)", margin: 0 }}>{order.tracking_code}</h1>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ padding: "10px 20px", borderRadius: "999px", background: `${statusColor}20`, color: statusColor, fontWeight: "700" }}>{order.status}</div>
            <div style={{ padding: "10px 20px", borderRadius: "999px", background: `${paymentColor}20`, color: paymentColor, fontWeight: "700" }}>
              {order.payment_status === "paid" ? "💳 Pagado" : "⏳ Pendiente"}
            </div>
          </div>
        </div>

        {/* GRID ADAPTATIVO */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={card}><h2>👤 Cliente</h2>
              <p>{order.customer_name}</p><p>{order.customer_phone}</p>
              <hr style={{ margin: "20px 0", opacity: 0.1 }} />
              <p>📦 Tipo: {order.order_type}</p>
              <p>💳 Método: {order.payment_method}</p>
            </div>

            <div style={card}><h2>🍔 Productos</h2>
              {order.order_items?.map((item: any) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                  <div><strong>{item.products?.name}</strong><div style={{ color: "#aaa" }}>Cant: {item.quantity}</div></div>
                  <strong>${Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={card}><h2>{order.order_type === "delivery" ? "📍 Información de Entrega" : "🛍️ Información de Retiro"}</h2>
              <p style={{ color: "#888", fontSize: "13px" }}>Dirección/Notas</p>
              <strong>{order.delivery_address || order.notes || "Sin información adicional"}</strong>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={card}><h2>💰 Resumen Financiero</h2>
              <Row label="Subtotal" value={order.subtotal} />
              <Row label="Delivery" value={order.delivery_fee} />
              <Row label="Total" value={order.total} />
              <hr style={{ margin: "20px 0", opacity: 0.1 }} />
              <Row label="Comisión Wolf" value={order.wolf_amount} />
              <Row label="Gana Restaurante" value={order.restaurant_amount} />
            </div>

            <div style={card}><h2>💳 Información de Pago</h2>
               <div style={{ padding: "14px", borderRadius: "16px", background: order.payment_status === "paid" ? "#22c55e20" : "#facc1520", color: order.payment_status === "paid" ? "#22c55e" : "#facc15", textAlign: "center", marginBottom: "20px" }}>
                 {order.payment_status === "paid" ? "✅ Pago Confirmado" : "⏳ Pago Pendiente"}
               </div>
               {order.cash_amount && (
                  <div style={{ background: "rgba(255,255,255,.03)", padding: "15px", borderRadius: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Cliente paga con</span><strong>${Number(order.cash_amount).toFixed(2)}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Debe devolver</span><strong style={{ color: "#f97316" }}>${Number(order.change_amount || 0).toFixed(2)}</strong></div>
                  </div>
               )}
            </div>

            {/* MÓDULO DE INFORMACIÓN (EL QUE FALTABA) */}
            <div style={card}>
              <h2>📊 Información</h2>
              <p>Fecha:</p><strong>{new Date(order.created_at).toLocaleString()}</strong>
              <hr style={{ margin: "20px 0", opacity: 0.1 }} />
              <p>🔖 Tracking:</p><strong style={{ color: "#f97316" }}>{order.tracking_code}</strong>
              <hr style={{ margin: "20px 0", opacity: 0.1 }} />
              <p>📦 Tipo Pedido:</p><strong style={{ textTransform: "capitalize" }}>{order.order_type}</strong>
            </div>

            <Link href="/admin/orders"><button style={{ ...btnStyle, background: "#333" }}>← Volver al Panel</button></Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const card = { background: "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "24px" };
const btnStyle = { width: "100%", padding: "16px", border: "none", borderRadius: "14px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontWeight: "bold", cursor: "pointer" };
function Row({ label, value }: any) { return <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}><span style={{ color: "#aaa" }}>{label}</span><strong>${Number(value || 0).toFixed(2)}</strong></div>; }