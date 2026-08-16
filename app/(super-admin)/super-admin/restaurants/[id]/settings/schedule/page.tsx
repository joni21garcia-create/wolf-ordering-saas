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
      <main className="schedule-page">
        <div className="schedule-wrap">
          <header className="schedule-header">
            <BackToSettings restaurantId={restaurantId} />
            <div className="eyebrow">Configuración · Operación</div>
            <div className="title-line">
              <div>
                <h1>Horarios</h1>
                <p>Define cuándo tu restaurante recibe pedidos.</p>
              </div>
              <span className="day-count">{days.length} días</span>
            </div>
          </header>

          {loading ? (
            <div className="loading-state">Cargando horarios...</div>
          ) : (
            <>
              <section className="schedule-list">
                {days.map((day, index) => {
                  const key = dayKeys[index];
                  const openVal =
                    schedule[`${key}_open` as keyof typeof schedule];
                  const closeVal =
                    schedule[`${key}_close` as keyof typeof schedule];
                  const isClosed = !openVal && !closeVal;

                  return (
                    <article
                      key={day}
                      className={`day-row ${isClosed ? "closed" : "open"}`}
                    >
                      <div className="day-main">
                        <div className="day-dot" />
                        <div>
                          <strong>{day}</strong>
                          <small>
                            {isClosed
                              ? "Cerrado"
                              : `${openVal} — ${closeVal}`}
                          </small>
                        </div>
                      </div>

                      <div className="day-controls">
                        <div className="time-fields">
                          <label>
                            <span>Abre</span>
                            <input
                              type="time"
                              disabled={isClosed}
                              value={openVal}
                              onChange={(e) =>
                                setSchedule({
                                  ...schedule,
                                  [`${key}_open`]: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label>
                            <span>Cierra</span>
                            <input
                              type="time"
                              disabled={isClosed}
                              value={closeVal}
                              onChange={(e) =>
                                setSchedule({
                                  ...schedule,
                                  [`${key}_close`]: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <button
                          type="button"
                          className={`day-switch ${isClosed ? "" : "active"}`}
                          onClick={() => toggleDayClosed(key, isClosed)}
                          aria-label={
                            isClosed
                              ? `Abrir ${day}`
                              : `Cerrar ${day}`
                          }
                        >
                          <span />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>

              <button
                onClick={saveSchedule}
                disabled={saving || loading}
                className="save-button"
              >
                {saving ? "Guardando..." : "Guardar horarios"}
              </button>
            </>
          )}
        </div>

        <style jsx global>{`
          .schedule-page {
            min-height:100vh;
            width:100%;
            box-sizing:border-box;
            padding:16px 12px 36px;
            background:#050505;
            color:#fff;
            font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          }

          .schedule-wrap {
            width:100%;
            max-width:650px;
            margin:0 auto;
          }

          .schedule-header {
            margin-bottom:11px;
          }

          .eyebrow {
            margin-top:8px;
            color:#f97316;
            font-size:8px;
            font-weight:800;
            letter-spacing:1px;
            text-transform:uppercase;
          }

          .title-line {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:3px;
          }

          .title-line h1 {
            margin:0;
            font-size:23px;
            line-height:1.1;
            letter-spacing:-.5px;
            font-weight:850;
          }

          .title-line p {
            margin:4px 0 0;
            color:rgba(255,255,255,.35);
            font-size:9px;
            line-height:1.4;
          }

          .day-count {
            flex-shrink:0;
            padding:5px 7px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:999px;
            color:rgba(255,255,255,.35);
            background:rgba(255,255,255,.025);
            font-size:7px;
            font-weight:800;
          }

          .loading-state {
            padding:30px 10px;
            text-align:center;
            color:rgba(255,255,255,.3);
            font-size:9px;
          }

          .schedule-list {
            display:flex;
            flex-direction:column;
            gap:5px;
          }

          .day-row {
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:9px;
            min-width:0;
            padding:8px 9px;
            border:1px solid rgba(255,255,255,.055);
            border-radius:9px;
            background:rgba(17,24,39,.58);
          }

          .day-row.closed {
            background:rgba(17,17,17,.48);
          }

          .day-main {
            display:flex;
            align-items:center;
            gap:7px;
            min-width:82px;
          }

          .day-dot {
            width:5px;
            height:5px;
            border-radius:50%;
            flex-shrink:0;
            background:#22c55e;
            box-shadow:0 0 7px rgba(34,197,94,.25);
          }

          .closed .day-dot {
            background:#555;
            box-shadow:none;
          }

          .day-main strong {
            display:block;
            font-size:9px;
            font-weight:800;
            white-space:nowrap;
          }

          .day-main small {
            display:block;
            margin-top:2px;
            color:rgba(255,255,255,.25);
            font-size:7px;
            white-space:nowrap;
          }

          .day-controls {
            display:flex;
            align-items:center;
            justify-content:flex-end;
            gap:6px;
            min-width:0;
            flex:1;
          }

          .time-fields {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:4px;
            min-width:0;
            width:min(210px,100%);
          }

          .time-fields label {
            min-width:0;
          }

          .time-fields label span {
            display:block;
            margin:0 0 2px 2px;
            color:rgba(255,255,255,.22);
            font-size:6px;
            font-weight:700;
            text-transform:uppercase;
          }

          .time-fields input {
            width:100%;
            min-width:0;
            height:29px;
            box-sizing:border-box;
            padding:4px 5px;
            border:1px solid rgba(255,255,255,.06);
            border-radius:6px;
            background:#0b0f16;
            color:#fff;
            outline:none;
            font:700 8px system-ui,sans-serif;
            color-scheme:dark;
          }

          .time-fields input:focus {
            border-color:rgba(249,115,22,.4);
            box-shadow:0 0 0 2px rgba(249,115,22,.06);
          }

          .time-fields input:disabled {
            opacity:.22;
          }

          .day-switch {
            position:relative;
            width:31px;
            height:18px;
            padding:0;
            border:0;
            border-radius:999px;
            background:#30343a;
            flex-shrink:0;
            cursor:pointer;
            transition:.18s;
          }

          .day-switch span {
            position:absolute;
            width:14px;
            height:14px;
            top:2px;
            left:2px;
            border-radius:50%;
            background:#fff;
            transition:.18s;
            box-shadow:0 1px 3px rgba(0,0,0,.35);
          }

          .day-switch.active {
            background:#22c55e;
          }

          .day-switch.active span {
            transform:translateX(13px);
          }

          .save-button {
            width:100%;
            min-height:38px;
            margin-top:7px;
            border:0;
            border-radius:8px;
            background:#f97316;
            color:#fff;
            font:800 9px system-ui,sans-serif;
            cursor:pointer;
          }

          .save-button:disabled {
            opacity:.5;
            cursor:not-allowed;
          }

          @media (max-width:480px) {
            .schedule-page {
              padding-left:9px;
              padding-right:9px;
            }

            .day-row {
              align-items:flex-start;
              padding:9px;
            }

            .day-main {
              min-width:72px;
              padding-top:8px;
            }

            .day-controls {
              flex-direction:column;
              align-items:stretch;
              gap:5px;
            }

            .time-fields {
              width:100%;
            }

            .day-switch {
              align-self:flex-end;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}