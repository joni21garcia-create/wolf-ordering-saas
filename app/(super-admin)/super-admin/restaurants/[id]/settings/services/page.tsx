"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ServicesPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const { data } = await supabase.from("restaurant_delivery_settings").select("*").eq("restaurant_id", restaurantId).maybeSingle();
    setSettings(data);
    setLoading(false);
  };

  const saveSettings = async () => {
    setSaving(true);
    const { error } = await supabase.from("restaurant_delivery_settings").update(settings).eq("restaurant_id", restaurantId);
    if (error) alert("Error guardando configuración");
    else alert("Configuración guardada");
    setSaving(false);
  };

  if (loading || !settings) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="services">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px, 5vw, 40px)", color: "#fff" }}>
        
        {/* HEADER */}
        <header style={{ marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(32px, 8vw, 52px)", fontWeight: "900", margin: "10px 0" }}>Delivery & Pickup</h1>
          <p style={{ color: "#888", maxWidth: "600px" }}>Gestiona los parámetros de entrega y retiro para tus clientes.</p>
        </header>

        {/* TOGGLES */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <ServiceCard 
            title="Delivery" icon="🚚" active={settings.delivery_enabled} 
            onChange={(v: boolean) => setSettings({...settings, delivery_enabled: v})} 
          />
          <ServiceCard 
            title="Pickup" icon="🏪" active={settings.pickup_enabled} 
            onChange={(v: boolean) => setSettings({...settings, pickup_enabled: v})} 
          />
        </div>

        {/* CONFIGURACIÓN */}
        <section style={sectionStyle}>
          <h2 style={{ marginBottom: "25px" }}>Configuración de Entrega</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <InputCard label="Radio (km)" value={settings.delivery_radius_km} onChange={(v: string) => setSettings({...settings, delivery_radius_km: v})} />
            <InputCard label="Costo Delivery" value={settings.delivery_fee} onChange={(v: string) => setSettings({...settings, delivery_fee: v})} />
            <InputCard label="Pedido Mínimo" value={settings.minimum_order} onChange={(v: string) => setSettings({...settings, minimum_order: v})} />
            <InputCard label="Prep (min)" value={settings.preparation_time} onChange={(v: string) => setSettings({...settings, preparation_time: v})} />
            <InputCard label="Entrega (min)" value={settings.delivery_time} onChange={(v: string) => setSettings({...settings, delivery_time: v})} />
          </div>
        </section>

        {/* DELIVERY GRATIS */}
        <section style={sectionStyle}>
          <label style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", fontSize: "18px", fontWeight: "600" }}>
            <input type="checkbox" checked={settings.free_delivery_enabled} onChange={(e) => setSettings({...settings, free_delivery_enabled: e.target.checked})} />
            🎁 Activar Delivery Gratis
          </label>
          {settings.free_delivery_enabled && (
            <div style={{ maxWidth: "300px" }}>
              <InputCard label="Monto mínimo para envío gratis" value={settings.free_delivery_minimum} onChange={(v: string) => setSettings({...settings, free_delivery_minimum: v})} />
            </div>
          )}
        </section>

        <button onClick={saveSettings} disabled={saving} style={saveBtn}>
          {saving ? "Guardando..." : "💾 Guardar Configuración"}
        </button>
      </main>
    </PermissionGuard>
  );
}

// ESTILOS Y SUBCOMPONENTES
const sectionStyle = { background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px", marginBottom: "20px" };
const saveBtn = { width: "100%", background: "#f97316", color: "#fff", border: "none", padding: "20px", borderRadius: "16px", fontWeight: "800", fontSize: "16px", cursor: "pointer", marginTop: "20px" };

function ServiceCard({ title, icon, active, onChange }: any) {
  return (
    <div style={sectionStyle}>
      <div style={{ fontSize: "40px", marginBottom: "10px" }}>{icon}</div>
      <h2 style={{ margin: "0 0 10px 0" }}>{title}</h2>
      <label style={{ display: "flex", gap: "10px", alignItems: "center", cursor: "pointer" }}>
        <input type="checkbox" checked={active} onChange={(e) => onChange(e.target.checked)} />
        {active ? "Activado" : "Desactivado"}
      </label>
    </div>
  );
}

function InputCard({ label, value, onChange }: any) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "12px" }} />
    </div>
  );
}