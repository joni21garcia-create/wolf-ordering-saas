"use client";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useParams } from "next/navigation";
import { useState } from "react";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const dayKeys = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function SchedulePage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState({
    monday_open: "08:00", monday_close: "22:00",
    tuesday_open: "08:00", tuesday_close: "22:00",
    wednesday_open: "08:00", wednesday_close: "22:00",
    thursday_open: "08:00", thursday_close: "22:00",
    friday_open: "08:00", friday_close: "22:00",
    saturday_open: "08:00", saturday_close: "22:00",
    sunday_open: "08:00", sunday_close: "22:00",
  });

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/schedule/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restaurantId, schedule }),
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
      <main style={{ minHeight: "100vh", padding: "clamp(20px, 5vw, 40px)", background: "#050505", color: "#fff" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          
          <header style={{ marginBottom: "30px" }}>
            <BackToSettings restaurantId={restaurantId} />
            <h1 style={{ fontSize: "clamp(28px, 6vw, 42px)", fontWeight: "900", margin: "10px 0" }}>🕒 Horarios</h1>
            <p style={{ color: "#9ca3af" }}>Configura los horarios de atención de tu restaurante.</p>
          </header>

          <section style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "20px" }}>
            {days.map((day, index) => {
              const key = dayKeys[index];
              return (
                <div key={day} style={{ display: "grid", gridTemplateColumns: "100px 1fr 1fr", gap: "10px", alignItems: "center", padding: "12px 0", borderBottom: index !== days.length - 1 ? "1px solid rgba(255,255,255,.06)" : "none" }}>
                  <strong style={{ fontSize: "14px" }}>{day}</strong>
                  <input type="time" value={schedule[`${key}_open` as keyof typeof schedule]} onChange={(e) => setSchedule({...schedule, [`${key}_open`]: e.target.value})} style={inputStyle} />
                  <input type="time" value={schedule[`${key}_close` as keyof typeof schedule]} onChange={(e) => setSchedule({...schedule, [`${key}_close`]: e.target.value})} style={inputStyle} />
                </div>
              );
            })}
          </section>

          <button onClick={saveSchedule} disabled={saving} style={saveBtn}>
            {saving ? "Guardando..." : "💾 Guardar Horarios"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

const inputStyle = { background: "#0f0f0f", color: "#fff", border: "1px solid #333", borderRadius: "8px", padding: "10px", width: "100%", fontSize: "14px" };
const saveBtn = { width: "100%", marginTop: "25px", background: "#f97316", color: "#fff", border: "none", padding: "18px", borderRadius: "16px", fontWeight: "800", fontSize: "16px", cursor: "pointer" };