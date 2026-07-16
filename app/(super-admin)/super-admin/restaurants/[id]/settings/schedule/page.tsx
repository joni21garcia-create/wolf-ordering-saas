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
        // Aseguramos que los valores nulos de la base de datos se manejen como strings vacíos en el estado
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

  // Función para alternar entre Cerrado y Abierto (con valor por defecto)
  const toggleDayClosed = (key: string, isCurrentlyClosed: boolean) => {
    if (isCurrentlyClosed) {
      // Si estaba cerrado y lo abren, ponemos un horario por defecto para que editen
      setSchedule({
        ...schedule,
        [`${key}_open`]: "08:30",
        [`${key}_close`]: "16:00"
      });
    } else {
      // Si lo cierran, vaciamos los campos de la base de datos
      setSchedule({
        ...schedule,
        [`${key}_open`]: "",
        [`${key}_close`]: ""
      });
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
              
              {/* Encabezado de Columnas adaptado */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "16px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid rgba(255,255,255,0.06)", opacity: 0.4, fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }} className="hide-on-mobile">
                <span>Día</span>
                <span>Apertura</span>
                <span>Cierre</span>
                <span style={{ textAlign: "right" }}>Estado</span>
              </div>

              {days.map((day, index) => {
                const key = dayKeys[index];
                const openVal = schedule[`${key}_open` as keyof typeof schedule];
                const closeVal = schedule[`${key}_close` as keyof typeof schedule];
                
                // Si ambos valores están vacíos, consideramos el día como "Cerrado"
                const isClosed = !openVal && !closeVal;

                return (
                  <div 
                    key={day} 
                    style={{ 
                      display: "grid", 
                      gridTemplateColumns: "1.2fr 1fr 1fr 1fr", 
                      gap: "16px", 
                      alignItems: "center", 
                      padding: "16px 0", 
                      borderBottom: index !== days.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                  >
                    <strong style={{ fontSize: "15px", fontWeight: "600", color: isClosed ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.95)" }}>
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

                    {/* Switch/Botón de Cerrado Premium */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => toggleDayClosed(key, isClosed)}
                        style={{
                          background: isClosed ? "rgba(239, 68, 68, 0.15)" : "rgba(255,255,255,0.05)",
                          border: isClosed ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255,255,255,0.08)",
                          color: isClosed ? "#f87171" : "rgba(255,255,255,0.6)",
                          padding: "8px 14px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
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
  colorScheme: "dark"
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