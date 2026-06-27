"use client";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useParams } from "next/navigation";
import { useState } from "react";

const days = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const dayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function SchedulePage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [saving, setSaving] =
    useState(false);

  const [schedule, setSchedule] =
    useState({
      monday_open: "08:00",
      monday_close: "22:00",

      tuesday_open: "08:00",
      tuesday_close: "22:00",

      wednesday_open: "08:00",
      wednesday_close: "22:00",

      thursday_open: "08:00",
      thursday_close: "22:00",

      friday_open: "08:00",
      friday_close: "22:00",

      saturday_open: "08:00",
      saturday_close: "22:00",

      sunday_open: "08:00",
      sunday_close: "22:00",
    });

  const saveSchedule =
    async () => {
      try {
        setSaving(true);

        console.log(
          "RESTAURANT ID:",
          restaurantId
        );

        const response =
          await fetch(
            "/api/schedule/save",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                restaurantId,
                schedule,
              }),
            }
          );

        const result =
          await response.json();

        if (
          result.success
        ) {
          alert(
            "Horarios guardados correctamente"
          );
        } else {
          alert(
            result.error
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Error al guardar horarios"
        );
      } finally {
        setSaving(false);
      }
    };

return (
  <PermissionGuard
    permission="schedule"
  >
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(circle at top right,#331300 0%,#050505 45%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                fontWeight: "900",
              }}
            >
              🕒 Horarios
            </h1>

            <p
              style={{
                color: "#9ca3af",
                marginTop: "10px",
              }}
            >
                <BackToSettings
  restaurantId={restaurantId}
/>
              Configura horarios de apertura y cierre del restaurante.
            </p>
          </div>

          <div
            style={{
              background:
                "rgba(34,197,94,.15)",
              color: "#22c55e",
              padding:
                "10px 18px",
              borderRadius:
                "999px",
              border:
                "1px solid rgba(34,197,94,.25)",
              fontWeight:
                "700",
            }}
          >
            Configuración activa
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius:
              "24px",
            padding: "30px",
            boxShadow:
              "0 20px 50px rgba(0,0,0,.4)",
          }}
        >
          {days.map(
            (
              day,
              index
            ) => {
              const key =
                dayKeys[index];

              return (
                <div
                  key={day}
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "200px 1fr 1fr",
                    gap: "20px",
                    alignItems:
                      "center",
                    padding:
                      "18px 0",
                    borderBottom:
                      index !==
                      days.length - 1
                        ? "1px solid rgba(255,255,255,.06)"
                        : "none",
                  }}
                >
                  <strong>
                    {day}
                  </strong>

                  <input
                    type="time"
                    value={
                      schedule[
                        `${key}_open` as keyof typeof schedule
                      ]
                    }
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        [`${key}_open`]:
                          e.target.value,
                      })
                    }
                    style={{
                      background:
                        "#0f0f0f",
                      color:
                        "#fff",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius:
                        "12px",
                      padding:
                        "12px",
                    }}
                  />

                  <input
                    type="time"
                    value={
                      schedule[
                        `${key}_close` as keyof typeof schedule
                      ]
                    }
                    onChange={(e) =>
                      setSchedule({
                        ...schedule,
                        [`${key}_close`]:
                          e.target.value,
                      })
                    }
                    style={{
                      background:
                        "#0f0f0f",
                      color:
                        "#fff",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius:
                        "12px",
                      padding:
                        "12px",
                    }}
                  />
                </div>
              );
            }
          )}

          <div
            style={{
              marginTop:
                "30px",
              display:
                "flex",
              justifyContent:
                "flex-end",
            }}
          >
            <button
              onClick={
                saveSchedule
              }
              disabled={
                saving
              }
              style={{
                background:
                  "#f97316",
                color:
                  "#fff",
                border:
                  "none",
                padding:
                  "14px 28px",
                borderRadius:
                  "14px",
                fontWeight:
                  "700",
                cursor:
                  "pointer",
              }}
            >
              {saving
                ? "Guardando..."
                : "💾 Guardar Horarios"}
            </button>
          </div>
        </div>
      </div>
     </main>
  </PermissionGuard>
);
}