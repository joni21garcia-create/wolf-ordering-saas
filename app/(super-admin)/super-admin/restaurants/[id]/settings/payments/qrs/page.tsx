"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface PaymentQR {
  id: string;
  restaurant_id: string;
  name: string;
  qr_image_url: string;
  account_holder: string | null;
  account_number: string | null;
  active: boolean;
  sort_order: number;
}

export default function PaymentQRsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [qrs, setQrs] = useState<PaymentQR[]>([]);

  useEffect(() => {
    loadQRs();
  }, []);

  const loadQRs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurant_payment_qrs")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setQrs((data || []) as PaymentQR[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleQR = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("restaurant_payment_qrs")
      .update({ active: !current })
      .eq("id", id);

    if (error) return alert("Error actualizando QR");
    loadQRs();
  };

  const deleteQR = async (id: string) => {
    if (!confirm("¿Eliminar este QR permanentemente?")) return;
    const { error } = await supabase
      .from("restaurant_payment_qrs")
      .delete()
      .eq("id", id);

    if (error) return alert("Error eliminando QR");
    loadQRs();
  };

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px", color: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <p style={{ color: "#888", marginBottom: "8px" }}>Configuración / Pagos / QRs</p>
          <h1 style={{ fontSize: "48px", fontWeight: "900", margin: 0 }}>QRs de Pago</h1>
        </div>
        <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}>
          <button style={buttonOrange}>+ Nuevo QR</button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "35px" }}>
        <StatCard title="Total QRs" value={qrs.length} />
        <StatCard title="Activos" value={qrs.filter(q => q.active).length} />
        <StatCard title="Ocultos" value={qrs.filter(q => !q.active).length} />
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Cargando QRs...</p>
      ) : qrs.length === 0 ? (
        <EmptyState restaurantId={restaurantId} />
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {qrs.map((qr) => (
            <div key={qr.id} style={cardStyle}>
              <img src={qr.qr_image_url} alt={qr.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "16px" }} />
              
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 5px 0" }}>{qr.name}</h3>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Titular: {qr.account_holder || "N/A"}</p>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Cuenta: {qr.account_number || "N/A"}</p>
                <span style={{ display: "inline-block", marginTop: "10px", padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "bold", background: qr.active ? "#22c55e20" : "#ef444420", color: qr.active ? "#22c55e" : "#ef4444" }}>
                  {qr.active ? "ACTIVO" : "OCULTO"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => toggleQR(qr.id, qr.active)} style={buttonSecondary}>
                  {qr.active ? "Ocultar" : "Mostrar"}
                </button>
                <button onClick={() => deleteQR(qr.id)} style={buttonDelete}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", display: "block" }}>
      <h2 style={{ margin: 0, fontSize: "24px" }}>{value}</h2>
      <p style={{ color: "#888", fontSize: "12px", textTransform: "uppercase", marginTop: "5px" }}>{title}</p>
    </div>
  );
}

function EmptyState({ restaurantId }: { restaurantId: string }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "60px", display: "block" }}>
      <h2>No hay QRs configurados</h2>
      <p style={{ color: "#888", marginBottom: "20px" }}>Crea tu primer código para recibir pagos.</p>
      <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`}>
        <button style={buttonOrange}>Crear Primer QR</button>
      </Link>
    </div>
  );
}

// Estilos compartidos
const cardStyle = { background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "20px", display: "flex", alignItems: "center", gap: "20px" };
const buttonBase = { padding: "12px 20px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "700" };
const buttonOrange = { ...buttonBase, background: "#f97316", color: "#fff" };
const buttonSecondary = { ...buttonBase, background: "rgba(255,255,255,.05)", color: "#fff", border: "1px solid rgba(255,255,255,.1)" };
const buttonDelete = { ...buttonBase, background: "#ef444420", color: "#ef4444", border: "1px solid #ef444455" };