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
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px) 16px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" }}>
      
      {/* HEADER RESPONSIVO */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <p style={{ color: "#71717a", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>Configuración / Pagos / QRs</p>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>QRs de Pago</h1>
        </div>
        <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`} style={{ textDecoration: "none", width: "auto" }}>
          <button style={buttonOrange}>✨ Nuevo QR</button>
        </Link>
      </div>

      {/* STATS CON SCROLL VERTICAL CONTROLADO EN GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        <StatCard title="Total QRs" value={qrs.length} color="#fff" />
        <StatCard title="Activos" value={qrs.filter(q => q.active).length} color="#22c55e" />
        <StatCard title="Ocultos" value={qrs.filter(q => !q.active).length} color="#ef4444" />
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#71717a" }}>Cargando QRs...</div>
      ) : qrs.length === 0 ? (
        <EmptyState restaurantId={restaurantId} />
      ) : (
        /* LISTADO DE TARJETAS FLUIDAS */
        <div style={{ display: "grid", gap: "16px" }}>
          {qrs.map((qr) => (
            <div key={qr.id} style={{
              ...cardStyle,
              display: "flex",
              flexWrap: "wrap", /* Permite romper fila a columna en móviles pequeños */
              alignItems: "center",
              gap: "20px"
            }}>
              
              {/* IMAGEN DEL QR */}
              <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "100px", margin: "0 auto" }}>
                <img src={qr.qr_image_url} alt={qr.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "14px", border: "1px solid #262626" }} />
              </div>
              
              {/* DATOS DE LA CUENTA */}
              <div style={{ flex: "1 1 250px", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700" }}>{qr.name}</h3>
                  <span style={{ 
                    padding: "3px 8px", 
                    borderRadius: "99px", 
                    fontSize: "10px", 
                    fontWeight: "700", 
                    letterSpacing: "0.5px",
                    background: qr.active ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", 
                    color: qr.active ? "#22c55e" : "#ef4444",
                    border: qr.active ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(239,68,68,0.15)"
                  }}>
                    {qr.active ? "ACTIVO" : "OCULTO"}
                  </span>
                </div>
                <p style={{ color: "#a1a1aa", fontSize: "13.5px", margin: "4px 0" }}>
                  <strong style={{ color: "#71717a", fontWeight: "500" }}>Titular:</strong> {qr.account_holder || "—"}
                </p>
                <p style={{ color: "#a1a1aa", fontSize: "13.5px", margin: "4px 0" }}>
                  <strong style={{ color: "#71717a", fontWeight: "500" }}>Cuenta:</strong> {qr.account_number || "—"}
                </p>
              </div>

              {/* ACCIONES (Se estiran al 100% en pantallas muy chicas) */}
              <div style={{ display: "flex", gap: "10px", flex: "1 1 auto", width: "100%", maxWidth: "300px", justifyContent: "flex-end" }}>
                <button onClick={() => toggleQR(qr.id, qr.active)} style={{ ...buttonSecondary, flex: 1 }}>
                  {qr.active ? "👁️ Ocultar" : "👁️ Mostrar"}
                </button>
                <button onClick={() => deleteQR(qr.id)} style={{ ...buttonDelete, flex: 1 }}>
                  🗑️ Eliminar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, color }: any) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", display: "block", padding: "16px" }}>
      <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: color }}>{value}</h2>
      <p style={{ color: "#71717a", fontSize: "11px", textTransform: "uppercase", marginTop: "4px", fontWeight: "600", letterSpacing: "0.5px" }}>{title}</p>
    </div>
  );
}

function EmptyState({ restaurantId }: { restaurantId: string }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
      <span style={{ fontSize: "40px" }}>📲</span>
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>No hay QRs configurados</h2>
      <p style={{ color: "#a1a1aa", fontSize: "14px", maxWidth: "320px", margin: "0 0 8px 0", lineHeight: 1.4 }}>
        Registra tus códigos QR de bancos preferidos para facilitarle el proceso de checkout a tus clientes.
      </p>
      <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs/new`} style={{ textDecoration: "none" }}>
        <button style={buttonOrange}>Crear Primer QR</button>
      </Link>
    </div>
  );
}

const cardStyle = { 
  background: "#121212", 
  border: "1px solid #222", 
  borderRadius: "20px", 
  padding: "20px",
  boxSizing: "border-box" as const
};

const buttonBase = { 
  padding: "12px 20px", 
  borderRadius: "12px", 
  border: "none", 
  cursor: "pointer", 
  fontWeight: "600" as const,
  fontSize: "13.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.2s ease"
};

const buttonOrange = { 
  ...buttonBase, 
  background: "#f97316", 
  color: "#fff",
  boxShadow: "0 4px 12px rgba(249,115,22,0.15)"
};

const buttonSecondary = { 
  ...buttonBase, 
  background: "#161616", 
  color: "#e4e4e7", 
  border: "1px solid #262626" 
};

const buttonDelete = { 
  ...buttonBase, 
  background: "rgba(239,68,68,0.07)", 
  color: "#ef4444", 
  border: "1px solid rgba(239,68,68,0.2)" 
};