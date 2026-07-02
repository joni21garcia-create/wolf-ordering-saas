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

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="payments">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px", color: "#fff" }}>
        <div style={{ marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "48px", fontWeight: "900", margin: "10px 0" }}>Centro de Pagos</h1>
          <p style={{ color: "#888" }}>Administra los métodos de pago aceptados y tiempos de preparación.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <StatCard title="QRs Configurados" value={qrCount} />
          <StatCard title="Tiempo Preparación" value={`${form.prep_time_min}-${form.prep_time_max} min`} />
          <StatCard title="Métodos Activos" value={[form.accepts_cash, form.accepts_transfer, form.accepts_qr, form.accepts_delivery_payment].filter(Boolean).length} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "25px" }}>
          <div style={{ display: "grid", gap: "25px" }}>
            <Section title="Métodos de Pago">
              <Switch label="Pago en efectivo" value={form.accepts_cash} onChange={(v: boolean) => setForm({ ...form, accepts_cash: v })} />
              <Switch label="Transferencia" value={form.accepts_transfer} onChange={(v: boolean) => setForm({ ...form, accepts_transfer: v })} />
              <Switch label="Pago QR" value={form.accepts_qr} onChange={(v: boolean) => setForm({ ...form, accepts_qr: v })} />
              <Switch label="Pago contra entrega" value={form.accepts_delivery_payment} onChange={(v: boolean) => setForm({ ...form, accepts_delivery_payment: v })} />
            </Section>

            <Section title="Cuenta Bancaria">
              <input placeholder="Nombre del Banco" value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })} style={inputStyle} />
              <input placeholder="Titular de la cuenta" value={form.account_holder} onChange={(e) => setForm({ ...form, account_holder: e.target.value })} style={inputStyle} />
              <input placeholder="Número de cuenta" value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} style={inputStyle} />
            </Section>
          </div>

          <div style={{ display: "grid", gap: "25px", height: "fit-content" }}>
            <Section title="Tiempo de Preparación (Min)">
              <input type="number" value={form.prep_time_min} onChange={(e) => setForm({ ...form, prep_time_min: Number(e.target.value) })} style={inputStyle} />
              <input type="number" value={form.prep_time_max} onChange={(e) => setForm({ ...form, prep_time_max: Number(e.target.value) })} style={inputStyle} />
            </Section>

            <Section title="QRs de Pago">
              <p style={{ color: "#888", fontSize: "14px", marginBottom: "15px" }}>Gestiona los códigos QR para pagos digitales.</p>
              <Link href={`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`}>
                <button style={buttonOrange}>Administrar QRs</button>
              </Link>
            </Section>

            <button onClick={saveSettings} disabled={saving} style={buttonGreen}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </main>
    </PermissionGuard>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div style={cardStyle}>
      <h2 style={{ margin: 0, fontSize: "28px" }}>{value}</h2>
      <p style={{ color: "#888", margin: "5px 0 0", fontSize: "12px", textTransform: "uppercase" }}>{title}</p>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div style={cardStyle}>
      <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>{title}</h2>
      {children}
    </div>
  );
}

function Switch({ label, value, onChange }: any) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
    </div>
  );
}

const cardStyle = { background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "25px" };
const inputStyle = { width: "100%", marginTop: "10px", padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff" };
const buttonBase = { width: "100%", padding: "14px", borderRadius: "14px", border: "none", cursor: "pointer", fontWeight: "700", color: "#fff" };
const buttonOrange = { ...buttonBase, background: "#f97316" };
const buttonGreen = { ...buttonBase, background: "#16a34a" };