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
  const [schedule, setSchedule] = useState({
    monday_open: "08:00", monday_close: "22:00",
    tuesday_open: "08:00", tuesday_close: "22:00",
    wednesday_open: "08:00", wednesday_close: "22:00",
    thursday_open: "08:00", thursday_close: "22:00",
    friday_open: "08:00", friday_close: "22:00",
    saturday_open: "08:00", saturday_close: "22:00",
    sunday_open: "08:00", sunday_close: "22:00",
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
      if (data.success && data.schedule) setSchedule(data.schedule);
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

  return (
    <PermissionGuard permission="schedule">
      <main style={{ minHeight: "100vh", padding: "clamp(24px, 5vw, 50px)", background: "#060606", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ maxWidth: "750px", margin: "0 auto" }}>
          
          <header style={{ marginBottom: "40px" }}>
            <BackToSettings restaurantId={restaurantId} />
            <h1 style={{ fontSize: "clamp(32px, 5vw, 42px)", fontWeight: "900", margin: "16px 0 8px", letterSpacing: "-1px" }}>
              Horarios de Atención
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", margin: 0 }}>
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
              borderRadius: "28px", 
              padding: "clamp(16px, 4vw, 32px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
            }}>
              
              {/* Encabezado Opcional Visual de Columnas en escritorio */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: 0.4, fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }} className="hide-on-mobile">
                <span>Día</span>
                <span>Apertura</span>
                <span>Cierre</span>
              </div>

              {days.map((day, index) => {
                const key = dayKeys[index];
                return (
                  <div 
                    key={day} 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1fr 1fr 1fr", 
                      gap: "16px", 
                      alignItems: "center", 
                      padding: "16px 0", 
                      borderBottom: index !== days.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <strong style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.95)" }}>
                      {day}
                    </strong>
                    
                    <div style={{ position: "relative" }}>
                      <input 
                        type="time" 
                        value={schedule[`${key}_open` as keyof typeof schedule]} 
                        onChange={(e) => setSchedule({...schedule, [`${key}_open`]: e.target.value})} 
                        style={inputStyle} 
                      />
                    </div>

                    <div style={{ position: "relative" }}>
                      <input 
                        type="time" 
                        value={schedule[`${key}_close` as keyof typeof schedule]} 
                        onChange={(e) => setSchedule({...schedule, [`${key}_close`]: e.target.value})} 
                        style={inputStyle} 
                      />
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
            {saving ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                Actualizando base de datos...
              </span>
            ) : "Guardar Horarios de Operación"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

const inputStyle = { 
  background: "#0b0b0b", 
  color: "#fff", 
  border: "1px solid rgba(255,255,255,0.08)", 
  borderRadius: "14px", 
  padding: "12px 16px", 
  width: "100%", 
  fontSize: "14px",
  fontWeight: "500",
  outline: "none",
  transition: "all 0.2s ease",
  boxSizing: "border-box" as const,
  colorScheme: "dark" // Fix definitivo para que el modal del reloj nativo en Chrome sea oscuro
};

const saveBtn = { 
  width: "100%", 
  marginTop: "30px", 
  border: "none", 
  padding: "18px", 
  borderRadius: "20px", 
  fontWeight: "700" as const, 
  fontSize: "16px", 
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  letterSpacing: "0.3px"
};