"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function PaymentsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qrCount, setQrCount] = useState(0);

  const [form, setForm] = useState({
    accepts_cash: true,
    accepts_transfer: false,
    accepts_qr: false,
    accepts_delivery_payment: true,
    bank_name: "",
    account_holder: "",
    account_number: "",
    prep_time_min: 20,
    prep_time_max: 30,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", restaurantId)
        .maybeSingle();

      if (restaurant) {
        setForm({
          accepts_cash: restaurant.accepts_cash ?? true,
          accepts_transfer: restaurant.accepts_transfer ?? false,
          accepts_qr: restaurant.accepts_qr ?? false,
          accepts_delivery_payment: restaurant.accepts_delivery_payment ?? true,
          bank_name: restaurant.bank_name || "",
          account_holder: restaurant.account_holder || "",
          account_number: restaurant.account_number || "",
          prep_time_min: restaurant.prep_time_min || 20,
          prep_time_max: restaurant.prep_time_max || 30,
        });
      }

      const { count } = await supabase
        .from("restaurant_payment_qrs")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);

      setQrCount(count || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("restaurants")
        .update({
          accepts_cash: form.accepts_cash,
          accepts_transfer: form.accepts_transfer,
          accepts_qr: form.accepts_qr,
          accepts_delivery_payment: form.accepts_delivery_payment,
          bank_name: form.bank_name,
          account_holder: form.account_holder,
          account_number: form.account_number,
          prep_time_min: form.prep_time_min,
          prep_time_max: form.prep_time_max,
        })
        .eq("id", restaurantId);

      if (error) throw error;
      alert("Configuración guardada exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: "40px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Cargando...
      </main>
    );
  }

  return (
    <PermissionGuard permission="payments">
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px) 16px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" }}>
        
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "24px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "800", marginTop: "12px", letterSpacing: "-0.5px", margin: "10px 0 6px 0" }}>
            Centro de Pagos
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "14px", margin: 0 }}>
            Administra los métodos de pago aceptados y tiempos de preparación.
          </p>
        </div>

        {/* CONTENEDOR DE TARJETAS DE ESTADÍSTICAS */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
          gap: "16px", 
          marginBottom: "24px" 
        }}>
          <StatCard title="QRs Configurados" value={qrCount} />
          <StatCard title="Tiempo Preparación" value={`${form.prep_time_min}-${form.prep_time_max} min`} />
          <StatCard title="Métodos Activos" value={[form.accepts_cash, form.accepts_transfer, form.accepts_qr, form.accepts_delivery_payment].filter(Boolean).length} />
        </div>

        {/* ESTRUCTURA PRINCIPAL AUTO-RESPONSIVA (SCROLL VERTICAL EN MÓVIL) */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", 
          gap: "24px" 
        }}>
          
          {/* COLUMNA / SECCIÓN DE MÉTODOS Y CUENTA */}
          <div style={{ display: "grid", gap: "24px", height: "fit-content" }}>
            <Section title="Métodos de Pago">
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Switch label="Pago en efectivo" value={form.accepts_cash} onChange={(v: boolean) => setForm({ ...form, accepts_cash: v })} />
                <Switch label="Transferencia" value={form.accepts_transfer} onChange={(v: boolean) => setForm({ ...form, accepts_transfer: v })} />
                <Switch label="Pago QR" value={form.accepts_qr} onChange={(v: boolean) => setForm({ ...form, accepts_qr: v })} />
                <Switch label="Pago contra entrega" value={form.accepts_delivery_payment} onChange={(v: boolean) => setForm({ ...form, accepts_delivery_payment: v })} />
              </div>
            </Section>

            <Section title="Cuenta Bancaria">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                <input placeholder="Nombre del Banco" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} style={inputStyle} />
                <input placeholder="Titular de la cuenta" value={form.account_holder} onChange={(e) => setForm({ ...form, account_holder: e.target.value })} style={inputStyle} />
                <input placeholder="Número de cuenta" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} style={inputStyle} />
              </div>
            </Section>
          </div>

          {/* COLUMNA / SECCIÓN DE TIEMPOS Y QRS */}
          <div style={{ display: "grid", gap: "24px", height: "fit-content" }}>
            <Section title="Tiempo de Preparación (Min)">
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#71717a", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Mínimo</span>
                  <input type="number" value={form.prep_time_min} onChange={(e) => setForm({ ...form, prep_time_min: Number(e.target.value) })} style={{ ...inputStyle, marginTop: 0 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: "11px", color: "#71717a", fontWeight: "600", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>Máximo</span>
                  <input type="number" value={form.prep_time_max} onChange={(e) => setForm({ ...form, prep_time_max: Number(e.target.value) })} style={{ ...inputStyle, marginTop: 0 }} />
                </div>
              </div>
            </Section>

            <Section title="QRs de Pago">
              <p style={{ color: "#a1a1aa", fontSize: "13.5px", marginBottom: "16px", marginTop: 0, lineHeight: 1.4 }}>
                Gestiona los códigos QR dinámicos para tus clientes durante el checkout.
              </p>
              <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`} style={{ textDecoration: "none" }}>
                <button style={buttonOrange}>🔗 Administrar QRs</button>
              </Link>
            </Section>

            {/* BOTÓN DE ACCIÓN GLOBAL ACCESIBLE */}
            <button onClick={saveSettings} disabled={saving} style={{ ...buttonGreen, opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
              {saving ? "Guardando..." : "💾 Guardar Todos los Cambios"}
            </button>
          </div>

        </div>
      </main>
    </PermissionGuard>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div style={{ ...cardStyle, padding: "18px 20px" }}>
      <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#f97316" }}>{value}</h2>
      <p style={{ color: "#71717a", margin: "4px 0 0", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: "600" }}>{title}</p>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "700", color: "#fff", letterSpacing: "-0.3px", marginTop: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Switch({ label, value, onChange }: any) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "12px 14px", 
      background: "#161616", 
      border: "1px solid #262626", 
      borderRadius: "12px",
      marginBottom: "8px"
    }}>
      <span style={{ fontSize: "13.5px", fontWeight: "500", color: "#e4e4e7" }}>{label}</span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: "42px",
          height: "22px",
          background: value ? "#16a34a" : "#2d2d2d",
          borderRadius: "11px",
          position: "relative",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            background: "#fff",
            borderRadius: "50%",
            position: "absolute",
            top: "3px",
            left: value ? "23px" : "3px",
            transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        />
      </div>
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

const inputStyle = { 
  width: "100%", 
  padding: "12px 14px", 
  borderRadius: "12px", 
  background: "#161616", 
  border: "1px solid #262626", 
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const
};

const buttonBase = { 
  width: "100%", 
  padding: "16px", 
  borderRadius: "14px", 
  border: "none", 
  cursor: "pointer", 
  fontWeight: "600" as const, 
  color: "#fff",
  fontSize: "14.5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box" as const,
  transition: "0.2s ease"
};

const buttonOrange = { ...buttonBase, background: "#f97316" };
const buttonGreen = { ...buttonBase, background: "#fff", color: "#000", fontWeight: "700" };