"use client";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function SchedulePage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Usamos strings vacíos "" por defecto para representar el estado "Cerrado"
  const [schedule, setSchedule] = useState({
    monday_open: "", monday_close: "",
    tuesday_open: "", tuesday_close: "",
    wednesday_open: "", wednesday_close: "",
    thursday_open: "", thursday_close: "",
    friday_open: "", friday_close: "",
    saturday_open: "", saturday_close: "",
    sunday_open: "", sunday_close: "",
  });

  // CARGAR DATOS AL MONTAR
  useEffect(() => {
    fetch("/api/schedule/get", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId }),
      cache: "no-store"
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.schedule) {
        const formattedSchedule = { ...schedule };
        Object.keys(schedule).forEach((key) => {
          formattedSchedule[key as keyof typeof schedule] = data.schedule[key] || "";
        });
        setSchedule(formattedSchedule);
      }
    })
    .finally(() => setLoading(false));
  }, [restaurantId]);

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/schedule/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, schedule }),
        cache: "no-store"
      });
      const result = await response.json();
      if (result.success) alert("Horarios guardados correctamente");
      else alert(result.error);
    } catch (error) {
      alert("Error al guardar horarios");
    } finally {
      setSaving(false);
    }
  };

  const toggleDayClosed = (key: string, isCurrentlyClosed: boolean) => {
    if (isCurrentlyClosed) {
      setSchedule({
        ...schedule,
        [`${key}_open`]: "08:30",
        [`${key}_close`]: "16:00"
      });
    } else {
      setSchedule({
        ...schedule,
        [`${key}_open`]: "",
        [`${key}_close`]: ""
      });
    }
  };

  return (
    <PermissionGuard permission="schedule">
      <main style={{ minHeight: "100vh", padding: "clamp(16px, 4vw, 50px)", background: "#060606", color: "#fff", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          
          <header style={{ marginBottom: "30px" }}>
            <BackToSettings restaurantId={restaurantId} />
            <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", fontWeight: "900", margin: "16px 0 8px", letterSpacing: "-1px" }}>
              Horarios de Atención
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
              Define los bloques de apertura y cierre para los pedidos digitales de tu local.
            </p>
          </header>

          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", letterSpacing: "0.5px" }}>Cargando configuración de la plataforma...</p>
            </div>
          ) : (
            <section style={{ 
              background: "rgba(15, 15, 15, 0.6)", 
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.06)", 
              borderRadius: "24px", 
              padding: "clamp(12px, 3vw, 28px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              
              {/* Encabezado de Columnas (Solo visible en pantallas medianas hacia arriba) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1fr", gap: "12px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: 0.4, fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }} className="desktop-header">
                <span>Día</span>
                <span>Apertura</span>
                <span>Cierre</span>
                <span style={{ textAlign: "right" }}>Estado</span>
              </div>

              {days.map((day, index) => {
                const key = dayKeys[index];
                const openVal = schedule[`${key}_open` as keyof typeof schedule];
                const closeVal = schedule[`${key}_close` as keyof typeof schedule];
                const isClosed = !openVal && !closeVal;

                return (
                  <div 
                    key={day} 
                    className="schedule-row"
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1.1fr 1fr 1fr 1fr", 
                      gap: "12px", 
                      alignItems: "center", 
                      padding: "14px 0", 
                      borderBottom: index !== days.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <strong style={{ fontSize: "14px", fontWeight: "600", color: isClosed ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.95)" }}>
                      {day}
                    </strong>
                    
                    {/* Apertura */}
                    <div style={{ position: "relative", opacity: isClosed ? 0.2 : 1, transition: "opacity 0.2s" }}>
                      <input 
                        type="time" 
                        disabled={isClosed}
                        value={openVal} 
                        onChange={(e) => setSchedule({...schedule, [`${key}_open`]: e.target.value})} 
                        style={inputStyle} 
                      />
                    </div>

                    {/* Cierre */}
                    <div style={{ position: "relative", opacity: isClosed ? 0.2 : 1, transition: "opacity 0.2s" }}>
                      <input 
                        type="time" 
                        disabled={isClosed}
                        value={closeVal} 
                        onChange={(e) => setSchedule({...schedule, [`${key}_close`]: e.target.value})} 
                        style={inputStyle} 
                      />
                    </div>

                    {/* Botón de Cerrado / Abierto */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => toggleDayClosed(key, isClosed)}
                        style={{
                          background: isClosed ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.05)",
                          border: isClosed ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                          color: isClosed ? "#f87171" : "rgba(255,255,255,0.6)",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          fontSize: "11px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {isClosed ? "🔒 Cerrado" : "🔓 Abierto"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          <button 
            onClick={saveSchedule} 
            disabled={saving || loading} 
            style={{
              ...saveBtn,
              background: saving ? "rgba(255,255,255,0.1)" : "#f97316",
              color: saving ? "rgba(255,255,255,0.4)" : "#fff",
              boxShadow: saving ? "none" : "0 10px 25px rgba(249, 115, 22, 0.25)"
            }}
          >
            {saving ? "Actualizando base de datos..." : "Guardar Horarios de Operación"}
          </button>
        </div>

        {/* Estilos CSS responsivos para asegurar que en móviles se adapte sin desbordarse */}
        <style jsx global>{`
          @media (max-width: 768px) {
            .desktop-header {
              display: none !important;
            }
            .schedule-row {
              grid-template-columns: 1fr 1fr !important;
              gap: 10px !important;
              padding: 16px 0 !important;
              background: rgba(255, 255, 255, 0.015);
              border-radius: 12px;
              margin-bottom: 8px;
              padding: 12px !important;
              border-bottom: 1px solid rgba(255,255,255,0.04) !important;
            }
            .schedule-row > strong {
              grid-column: span 2;
              font-size: 15px !important;
              border-bottom: 1px solid rgba(255,255,255,0.04);
              padding-bottom: 6px;
              margin-bottom: 2px;
            }
            .schedule-row > div:last-child {
              grid-column: span 2;
              justify-content: flex-start !important;
            }
            .schedule-row button {
              width: 100%;
              justify-content: center;
              padding: 10px !important;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

const inputStyle = { 
  background: "#0b0b0b", 
  color: "#fff", 
  border: "1px solid rgba(255,255,255,0.08)", 
  borderRadius: "12px", 
  padding: "10px 12px", 
  width: "100%", 
  fontSize: "13px",
  fontWeight: "500",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box" as const,
  colorScheme: "dark"
};

const saveBtn = { 
  width: "100%", 
  marginTop: "24px", 
  border: "none", 
  padding: "16px", 
  borderRadius: "16px", 
  fontWeight: "700" as const, 
  fontSize: "15px", 
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  letterSpacing: "0.3px"
};