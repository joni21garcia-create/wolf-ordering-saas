"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { supabase } from "@/lib/supabase/client";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const lastOrderIdRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderAlert, setNewOrderAlert] = useState<any>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => { loadOrders(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/orders/get-orders", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const result = await response.json();
      if (result.success) {
        const today = new Date().toISOString().split("T")[0];
        const newOrders = (result.orders || []).filter((order: any) => order.created_at?.startsWith(today));
        const newestOrder = [...newOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        if (newestOrder && lastOrderIdRef.current && newestOrder.id !== lastOrderIdRef.current) {
          if (soundEnabled) audioRef.current?.play();
          setNewOrderAlert(newestOrder);
          setTimeout(() => setNewOrderAlert(null), 5000);
        }
        lastOrderIdRef.current = newestOrder?.id || null;
        setOrders(newOrders);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/orders/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ orderId, status }),
      });
      loadOrders();
    } catch (error) { console.error(error); }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch("/api/orders/update-payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ orderId, paymentStatus }),
      });
      loadOrders();
    } catch (error) { console.error(error); }
  };

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const acceptedOrders = orders.filter((o) => o.status === "accepted" || o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const todaySales = orders.reduce((total, order) => total + Number(order.total || 0), 0);
  const wolfRevenue = orders.reduce((total, order) => total + Number(order.wolf_amount || 0), 0);
  const restaurantRevenue = orders.reduce((total, order) => total + Number(order.restaurant_amount || 0), 0);

  return (
    <PermissionGuard permission="orders">
      <audio ref={audioRef} src="/sounds/new-order.mp3" preload="auto" />
      {newOrderAlert && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", padding: "24px", borderRadius: "24px", minWidth: "340px", border: "1px solid rgba(255,255,255,.15)", backdropFilter: "blur(20px)", boxShadow: "0 25px 60px rgba(0,0,0,.45)" }}>
          <h3 style={{ margin: 0, marginBottom: "10px" }}>🐺 Nuevo Pedido</h3>
          <div>Cliente: {newOrderAlert.customer_name}</div>
          <div>Total: ${Number(newOrderAlert.total).toFixed(2)}</div>
        </div>
      )}
      <main style={{ minHeight: "100vh", background: "#050505", padding: "40px" }}>
        <div style={{ maxWidth: "1800px", margin: "0 auto" }}>
          <h1 style={{ color: "#fff", fontSize: "58px", fontWeight: "900", marginBottom: "40px" }}>🐺 Wolf Operations Center</h1>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            <DashboardCard title="🟡 Nuevos" value={pendingOrders.length} />
            <DashboardCard title="🟠 Cocina" value={acceptedOrders.length} />
            <DashboardCard title="🔵 Listos" value={readyOrders.length} />
            <DashboardCard title="💰 Ventas" value={`$${todaySales.toFixed(2)}`} />
            <DashboardCard title="🐺 Wolf" value={`$${wolfRevenue.toFixed(2)}`} />
            <DashboardCard title="🏪 Restaurante" value={`$${restaurantRevenue.toFixed(2)}`} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(320px, 1fr))", gap: "20px" }}>
            <OrderColumn title="🟡 Nuevos" orders={pendingOrders} updateStatus={updateStatus} updatePaymentStatus={updatePaymentStatus} />
            <OrderColumn title="🟠 Cocina" orders={acceptedOrders} updateStatus={updateStatus} updatePaymentStatus={updatePaymentStatus} />
            <OrderColumn title="🔵 Listos" orders={readyOrders} updateStatus={updateStatus} updatePaymentStatus={updatePaymentStatus} />
            <OrderColumn title="🟢 Historial" orders={completedOrders} updateStatus={updateStatus} updatePaymentStatus={updatePaymentStatus} />
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}

function DashboardCard({ title, value }: any) {
  return (
    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: "30px", padding: "24px" }}>
      <p style={{ color: "#888", fontSize: "14px", textTransform: "uppercase" }}>{title}</p>
      <h2 style={{ color: "#fff", fontSize: "34px", fontWeight: "800" }}>{value}</h2>
    </div>
  );
}

function OrderColumn({ title, orders, updateStatus, updatePaymentStatus }: any) {
  return (
    <div>
      <h2 style={{ color: "#fff", marginBottom: "20px" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {orders.map((order: any) => (
          <div key={order.id} style={{ background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: "22px", padding: "20px", color: "#fff" }}>
            <h3>{order.tracking_code}</h3>
            <p>👤 {order.customer_name}</p>
            <p>📞 {order.customer_phone}</p>
            <p>💰 Total: ${Number(order.total).toFixed(2)}</p>
            <p style={{ color: "#f97316" }}>🐺 Wolf: ${Number(order.wolf_amount || 0).toFixed(2)}</p>
            <p style={{ color: "#22c55e" }}>🏪 Rest: ${Number(order.restaurant_amount || 0).toFixed(2)}</p>
            <p>💳 {order.payment_status === "paid" ? "🟢 Pagado" : "🟡 Pendiente"}</p>
            
            {order.payment_status !== "paid" && <button onClick={() => updatePaymentStatus(order.id, "paid")} style={buttonGreen}>Confirmar Pago</button>}
            
            {order.status === "pending" && (
              <>
                <button style={buttonGreen} onClick={() => updateStatus(order.id, "accepted")}>Aceptar</button>
                <button style={buttonRed} onClick={() => updateStatus(order.id, "cancelled")}>Cancelar</button>
              </>
            )}
            {order.status === "accepted" && <button style={buttonOrange} onClick={() => updateStatus(order.id, "preparing")}>Preparar</button>}
            {order.status === "preparing" && <button style={buttonBlue} onClick={() => updateStatus(order.id, "ready")}>Pedido Listo</button>}
            {order.status === "ready" && <button style={buttonGreen} onClick={() => updateStatus(order.id, "completed")}>Entregar</button>}
            
            <Link href={`/admin/orders/${order.id}`}><button style={buttonOrange}>Ver detalle</button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const buttonBase = { width: "100%", marginTop: "10px", padding: "12px", border: "none", borderRadius: "12px", color: "#fff", cursor: "pointer", fontWeight: "700" };
const buttonOrange = { ...buttonBase, background: "#f97316" };
const buttonGreen = { ...buttonBase, background: "#16a34a" };
const buttonBlue = { ...buttonBase, background: "#2563eb" };
const buttonRed = { ...buttonBase, background: "#dc2626" };