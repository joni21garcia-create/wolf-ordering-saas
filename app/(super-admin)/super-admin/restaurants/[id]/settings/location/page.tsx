"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function LocationPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<any>(null);

  useEffect(() => { loadLocation(); }, []);

  const loadLocation = async () => {
    const { data } = await supabase.from("restaurants").select("id, address, latitude, longitude, google_maps_url, name").eq("id", restaurantId).maybeSingle();
    setLocation(data);
    setLoading(false);
  };

  const saveLocation = async () => {
    setSaving(true);
    const { error } = await supabase.from("restaurants").update({
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      google_maps_url: location.google_maps_url,
    }).eq("id", restaurantId);

    if (error) alert("Error guardando ubicación");
    else alert("Ubicación guardada correctamente");
    setSaving(false);
  };

  if (loading || !location) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  const mapsUrl = location.google_maps_url?.trim() || `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  return (
    <PermissionGuard permission="location">
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px, 5vw, 40px)", color: "#fff" }}>
        
        {/* HEADER */}
        <header style={{ marginBottom: "40px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "clamp(32px, 8vw, 52px)", fontWeight: "900", margin: "10px 0" }}>Ubicación</h1>
          <p style={{ color: "#888", maxWidth: "600px" }}>Configura la ubicación exacta del restaurante para mapas y rutas.</p>
        </header>

        {/* FORMULARIO */}
        <section style={sectionStyle}>
          <h2 style={{ marginBottom: "25px" }}>📍 Datos Geográficos</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            <TextCard label="Dirección" value={location.address} onChange={(v: string) => setLocation({...location, address: v})} />
            <TextCard label="Latitud" value={location.latitude} onChange={(v: string) => setLocation({...location, latitude: v})} />
            <TextCard label="Longitud" value={location.longitude} onChange={(v: string) => setLocation({...location, longitude: v})} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <TextCard label="URL Google Maps (Opcional)" value={location.google_maps_url} onChange={(v: string) => setLocation({...location, google_maps_url: v})} />
          </div>
        </section>

        {/* VISTA PREVIA */}
        <section style={sectionStyle}>
          <h2 style={{ marginBottom: "20px" }}>🗺 Vista Previa</h2>
          {location.latitude && location.longitude ? (
            <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid #333" }}>
              <iframe 
                src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`} 
                width="100%" height="300" style={{ border: "none" }} loading="lazy" 
              />
            </div>
          ) : <div style={{ padding: "40px", textAlign: "center", color: "#777" }}>Ingresa coordenadas para ver el mapa.</div>}
          
          <div style={{ display: "flex", gap: "15px", marginTop: "25px", flexWrap: "wrap" }}>
            <a href={mapsUrl} target="_blank" style={btnPrimary}>📍 Abrir Google Maps</a>
            <button onClick={() => { navigator.clipboard.writeText(`${location.latitude}, ${location.longitude}`); alert("Copiado"); }} style={btnSecondary}>📋 Copiar Coordenadas</button>
          </div>
        </section>

        <button onClick={saveLocation} disabled={saving} style={saveBtn}>
          {saving ? "Guardando..." : "💾 Guardar Ubicación"}
        </button>
      </main>
    </PermissionGuard>
  );
}

// ESTILOS
const sectionStyle = { background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px", marginBottom: "20px" };
const saveBtn = { width: "100%", background: "#f97316", color: "#fff", border: "none", padding: "20px", borderRadius: "16px", fontWeight: "800", fontSize: "16px", cursor: "pointer" };
const btnPrimary = { background: "#2563eb", color: "#fff", padding: "12px 20px", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "14px" };
const btnSecondary = { background: "#111", border: "1px solid #333", color: "#fff", padding: "12px 20px", borderRadius: "12px", cursor: "pointer", fontWeight: "600", fontSize: "14px" };

function TextCard({ label, value, onChange }: any) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "8px", color: "#888", fontSize: "14px" }}>{label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} 
        style={{ width: "100%", background: "#111", border: "1px solid #333", color: "#fff", padding: "12px", borderRadius: "12px" }} />
    </div>
  );
}