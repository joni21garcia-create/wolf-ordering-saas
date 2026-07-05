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
    loading_false();
  };

  const loading_false = () => {
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

  if (loading || !location) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060606", color: "rgba(255,255,255,0.4)" }}>
        Cargando interfaz de geolocalización...
      </main>
    );
  }

  const mapsUrl = location.google_maps_url?.trim() || `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

  return (
    <PermissionGuard permission="location">
      <main style={{ minHeight: "100vh", background: "#060606", color: "#fff", padding: "clamp(24px, 5vw, 50px)", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* HEADER */}
          <header style={{ marginBottom: "40px" }}>
            <BackToSettings restaurantId={restaurantId} />
            <h1 style={{ fontSize: "clamp(32px, 6vw, 46px)", fontWeight: "900", margin: "16px 0 8px", letterSpacing: "-1px" }}>
              Ubicación del Local
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", maxWidth: "600px", margin: 0 }}>
              Configura las coordenadas y enlaces de mapas para que tus clientes y repartidores lleguen sin problemas.
            </p>
          </header>

          {/* CONTENIDO PRINCIPAL: DOS COLUMNAS ASIMÉTRICAS EN ESCRITORIO */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "30px", alignItems: "start" }}>
            
            {/* FORMULARIO */}
            <section style={sectionStyle}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "24px", color: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📍</span> Datos Geográficos
              </h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <TextCard label="Dirección Comercial" value={location.address} onChange={(v: string) => setLocation({...location, address: v})} />
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <TextCard label="Latitud" value={location.latitude} onChange={(v: string) => setLocation({...location, latitude: v})} />
                  <TextCard label="Longitud" value={location.longitude} onChange={(v: string) => setLocation({...location, longitude: v})} />
                </div>

                <TextCard label="URL de Google Maps (Opcional)" value={location.google_maps_url} onChange={(v: string) => setLocation({...location, google_maps_url: v})} />
              </div>
            </section>

            {/* VISTA PREVIA DEL MAPA */}
            <section style={sectionStyle}>
              <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>🗺️</span> Vista Previa Satelital
              </h2>
              
              {location.latitude && location.longitude ? (
                <div style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", background: "#111" }}>
                  <iframe 
                    src={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`} 
                    width="100%" height="280" style={{ border: "none", filter: "invert(90%) hue-rotate(180deg) grayscale(10%)", opacity: 0.85 }} loading="lazy" 
                  />
                </div>
              ) : (
                <div style={{ padding: "60px 20px", textAlign: "center", color: "rgba(255,255,255,0.3)", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "20px", fontSize: "14px" }}>
                  Ingresa coordenadas válidas para generar el mapa.
                </div>
              )}
              
              <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                <a href={mapsUrl} target="_blank" style={btnPrimary}>
                  Abrir en Google Maps
                </a>
                <button onClick={() => { navigator.clipboard.writeText(`${location.latitude}, ${location.longitude}`); alert("Copiado"); }} style={btnSecondary}>
                  Copiar Coordenadas
                </button>
              </div>
            </section>

          </div>

          {/* BOTÓN DE ACCIÓN GLOBAL */}
          <button 
            onClick={saveLocation} 
            disabled={saving} 
            style={{
              ...saveBtn,
              background: saving ? "rgba(255,255,255,0.1)" : "#f97316",
              color: saving ? "rgba(255,255,255,0.3)" : "#fff",
              boxShadow: saving ? "none" : "0 10px 25px rgba(249, 115, 22, 0.25)"
            }}
          >
            {saving ? "Guardando cambios en servidor..." : "Guardar Configuración Geográfica"}
          </button>

        </div>
      </main>
    </PermissionGuard>
  );
}

// ESTILOS PREMIUM INTEGRADOS
const sectionStyle = { 
  background: "rgba(15, 15, 15, 0.6)", 
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.06)", 
  borderRadius: "28px", 
  padding: "clamp(20px, 4vw, 32px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  boxSizing: "border-box" as const
};

const saveBtn = { 
  width: "100%", 
  marginTop: "35px", 
  border: "none", 
  padding: "18px", 
  borderRadius: "20px", 
  fontWeight: "700" as const, 
  fontSize: "16px", 
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  letterSpacing: "0.2px"
};

const btnPrimary = { 
  background: "rgba(255, 255, 255, 0.08)", 
  color: "#fff", 
  border: "1px solid rgba(255, 255, 255, 0.12)",
  padding: "14px 22px", 
  borderRadius: "14px", 
  textDecoration: "none", 
  fontWeight: "600" as const, 
  fontSize: "14px",
  flex: 1,
  textAlign: "center" as const,
  transition: "background 0.2s ease"
};

const btnSecondary = { 
  background: "transparent", 
  border: "1px solid rgba(255,255,255,0.06)", 
  color: "rgba(255,255,255,0.6)", 
  padding: "14px 22px", 
  borderRadius: "14px", 
  cursor: "pointer", 
  fontWeight: "600" as const, 
  fontSize: "14px",
  flex: 1,
  transition: "all 0.2s ease"
};

function TextCard({ label, value, onChange }: any) {
  return (
    <div style={{ width: "100%" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: "600", letterSpacing: "0.3px" }}>
        {label}
      </label>
      <input 
        type="text" 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        style={{ 
          width: "100%", 
          background: "#0b0b0b", 
          border: "1px solid rgba(255,255,255,0.08)", 
          color: "#fff", 
          padding: "14px 16px", 
          borderRadius: "14px",
          fontSize: "14px",
          fontWeight: "500",
          outline: "none",
          boxSizing: "border-box" as const,
          transition: "border 0.2s ease"
        }} 
      />
    </div>
  );
}