import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  const { data: order } = await supabase
    .from("orders")
    .select(`
        *,
        order_items (
          *,
          products (
            id,
            name
          )
        )
      `)
    .eq("id", id)
    .maybeSingle();

  if (!order) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050505", color: "#fff" }}>
        Pedido no encontrado
      </main>
    );
  }

  const statusColor = order.status === "completed" ? "#22c55e" : order.status === "cancelled" ? "#ef4444" : "#f97316";
  const paymentColor = order.payment_status === "paid" ? "#22c55e" : "#facc15";

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg,#050505,#0b0b0b)", padding: "20px" }}>
      <div style={{ maxWidth: "1500px", margin: "0 auto" }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", marginBottom: "35px" }}>
          <div>
            <div style={{ color: "#777", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "2px" }}>Pedido</div>
            <h1 style={{ color: "#fff", fontSize: "clamp(32px, 5vw, 58px)", margin: 0, fontWeight: 800 }}>{order.tracking_code}</h1>
          </div>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={{ padding: "14px 24px", borderRadius: "999px", background: `${statusColor}20`, color: statusColor, fontWeight: "700" }}>{order.status}</div>
            <div style={{ padding: "14px 24px", borderRadius: "999px", background: `${paymentColor}20`, color: paymentColor, fontWeight: "700" }}>
              {order.payment_status === "paid" ? "💳 Pagado" : "⏳ Pendiente"}
            </div>
          </div>
        </div>

        {/* CONTENEDOR RESPONSIVO */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "25px", alignItems: "flex-start" }}>
          
          {/* IZQUIERDA */}
          <div style={{ flex: "1 1 600px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={card}>
              <h2>👤 Cliente</h2>
              <p>{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              {order.customer_email && <p>{order.customer_email}</p>}
              <hr style={{ margin: "20px 0", borderColor: "rgba(255,255,255,.08)" }} />
              <p>📦 Tipo: {order.order_type}</p>
              <p>💳 Método: {order.payment_method}</p>
              {order.selected_qr_name && <p>🏦 QR: {order.selected_qr_name}</p>}
            </div>

            <div style={card}>
              <h2>🍔 Productos</h2>
              {order.order_items?.map((item: any) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                  <div>
                    <strong style={{ fontSize: "18px" }}>{item.products?.name}</strong>
                    <div style={{ marginTop: "6px", color: "#aaa" }}>Cantidad: {item.quantity}</div>
                  </div>
                  <strong style={{ fontSize: "20px" }}>${Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div style={card}>
              <h2>{order.order_type === "delivery" ? "📍 Información de Entrega" : "🛍️ Información de Retiro"}</h2>
              {order.order_type === "delivery" ? (
                <>
                  {["Dirección", "Sector", "Instrucciones", "Notas"].map((label) => (
                    <div key={label} style={{ marginBottom: "18px" }}>
                      <div style={{ color: "#888", fontSize: "13px", marginBottom: "5px" }}>{label}</div>
                      <strong>{order[label.toLowerCase() === "dirección" ? "delivery_address" : label.toLowerCase() === "sector" ? "delivery_sector" : label.toLowerCase() === "instrucciones" ? "delivery_instructions" : "notes"] || "No registrado"}</strong>
                    </div>
                  ))}
                </>
              ) : (
                <div><div style={{ color: "#888", fontSize: "13px", marginBottom: "5px" }}>Notas para retiro</div><strong>{order.notes || "Sin notas"}</strong></div>
              )}
            </div>
          </div>

          {/* DERECHA */}
          <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: "25px" }}>
            <div style={card}>
              <h2>💰 Resumen Financiero</h2>
              <Row label="Subtotal" value={order.subtotal} />
              <Row label="Delivery" value={order.delivery_fee} />
              <Row label="Total Cliente" value={order.total} />
              <hr style={{ margin: "20px 0", borderColor: "rgba(255,255,255,.08)" }} />
              <Row label="🐺 Comisión Wolf" value={order.wolf_amount} />
              <Row label="🏪 Gana Restaurante" value={order.restaurant_amount} />
            </div>

            <div style={card}>
              <h2>💳 Información de Pago</h2>
              <div style={{ padding: "14px", borderRadius: "16px", background: order.payment_status === "paid" ? "#22c55e20" : "#facc1520", color: order.payment_status === "paid" ? "#22c55e" : "#facc15", fontWeight: 700, textAlign: "center", marginBottom: "20px" }}>
                {order.payment_status === "paid" ? "✅ Pago Confirmado" : "⏳ Pago Pendiente"}
              </div>
              <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "18px", padding: "18px" }}>
                <div style={{ color: "#888", fontSize: "13px" }}>Método de Pago</div>
                <div style={{ fontSize: "20px", fontWeight: "700" }}>{order.payment_method}</div>
              </div>
              {order.payment_proof_url && (
                <div style={{ marginTop: "20px" }}>
                  <img src={order.payment_proof_url} alt="Comprobante" style={{ width: "100%", borderRadius: "10px" }} />
                  <a href={order.payment_proof_url} target="_blank" rel="noreferrer">
                    <button style={{ width: "100%", padding: "16px", marginTop: "10px", border: "none", borderRadius: "14px", background: "#f97316", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Ver Comprobante</button>
                  </a>
                </div>
              )}
            </div>

            <Link href="/admin/orders">
              <button style={{ width: "100%", padding: "18px", border: "none", borderRadius: "18px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontWeight: "800", cursor: "pointer" }}>
                ← Volver al Panel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
      <span style={{ color: "#aaa" }}>{label}</span>
      <strong>${Number(value || 0).toFixed(2)}</strong>
    </div>
  );
}

const card = {
  background: "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03))",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "28px",
  padding: "28px",
  color: "#fff",
  backdropFilter: "blur(25px)",
  boxShadow: "0 10px 40px rgba(0,0,0,.25)",
};