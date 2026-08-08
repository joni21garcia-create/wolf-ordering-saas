"use client";

import { useState } from "react";

interface HoursPanelProps {
  restaurantId: string;
  schedule: Record<string, unknown> | null;
  isOpen: boolean;
  onToggleReceivingOrders?: () => void;
  saving?: boolean;
}

type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

const DAYS: Array<{
  key: DayKey;
  label: string;
}> = [
  { key: "sunday", label: "Domingo" },
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
];

function getTime(
  schedule: Record<string, unknown> | null,
  day: DayKey,
  type: "open" | "close",
) {
  if (!schedule) return null;

  const value = schedule[`${day}_${type}`];

  return typeof value === "string"
    ? value
    : null;
}

function formatTime(value: string | null) {
  if (!value) return "";

  const parts = value.split(":");
  const hour = Number(parts[0]);
  const minute = Number(parts[1]);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return value;
  }

  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function ClockIcon({
  size = 20,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 7V12L15 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HoursPanel({
  restaurantId,
  schedule,
  isOpen,
  onToggleReceivingOrders,
  saving = false,
}: HoursPanelProps) {
  const [openDay, setOpenDay] =
    useState<DayKey | null>(null);

  const [savingDay, setSavingDay] =
    useState<DayKey | null>(null);

  const toggleDayReceiving = async (
    dayKey: DayKey,
    currentlyOpen: boolean,
  ) => {
    if (!schedule || savingDay) return;

    const openKey = `${dayKey}_open`;
    const closeKey = `${dayKey}_close`;

    const currentOpen =
      typeof schedule[openKey] === "string"
        ? String(schedule[openKey])
        : "";

    const currentClose =
      typeof schedule[closeKey] === "string"
        ? String(schedule[closeKey])
        : "";

    const storageKey =
      `wolf-hours-${restaurantId}-${dayKey}`;

    let nextSchedule = {
      ...schedule,
    };

    if (currentlyOpen) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          open: currentOpen,
          close: currentClose,
        }),
      );

      nextSchedule[openKey] = "";
      nextSchedule[closeKey] = "";
    } else {
      const saved =
        localStorage.getItem(storageKey);

      if (!saved) {
        console.warn(
          `No hay horario guardado para ${dayKey}`,
        );
        return;
      }

      const original =
        JSON.parse(saved) as {
          open?: string;
          close?: string;
        };

      if (!original.open || !original.close) {
        return;
      }

      nextSchedule[openKey] = original.open;
      nextSchedule[closeKey] = original.close;
    }

    setSavingDay(dayKey);

    try {
      const response = await fetch(
        "/api/schedule/save",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            restaurantId,
            schedule: nextSchedule,
          }),
          cache: "no-store",
        },
      );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.error ||
            "No se pudo guardar el horario",
        );
      }

      Object.assign(schedule, nextSchedule);
    } catch (error) {
      console.error(
        "Error cambiando recepción del día:",
        error,
      );
    } finally {
      setSavingDay(null);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          marginTop: 14,
          padding: 16,
          boxSizing: "border-box",
          borderRadius: 18,
          background: "#121212",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <button
          type="button"
          onClick={onToggleReceivingOrders}
          disabled={!onToggleReceivingOrders || saving}
          style={{
            width: "100%",
            minHeight: 46,
            border: "none",
            borderRadius: 13,
            padding: "12px 16px",
            background: isOpen
              ? "rgba(239,68,68,.12)"
              : "#F97316",
            color: isOpen
              ? "#EF4444"
              : "#FFFFFF",
            fontSize: 13,
            fontWeight: 800,
            cursor:
              !onToggleReceivingOrders || saving
                ? "default"
                : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving
            ? "Guardando..."
            : isOpen
              ? "Dejar de recibir pedidos"
              : "Reanudar recepción de pedidos"}
        </button>
      </section>
      <div
        style={{
          padding: "7px 4px 13px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              color: "#F97316",
              display: "flex",
            }}
          >
            <ClockIcon size={19} />
          </span>

          <h2
            style={{
              margin: 0,
              fontSize: 18,
              lineHeight: 1.2,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            Horarios
          </h2>
        </div>

        <p
          style={{
            margin: "6px 0 0",
            fontSize: 12,
            lineHeight: 1.4,
            color: "#71717A",
          }}
        >
          Consulta el horario y si el restaurante está recibiendo pedidos.
        </p>
      </div>

      <section
        style={{
          width: "100%",
          padding: 18,
          boxSizing: "border-box",
          borderRadius: 18,
          background: "#121212",
          border:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              background: isOpen
                ? "rgba(34,197,94,.12)"
                : "rgba(239,68,68,.12)",
              color: isOpen
                ? "#22C55E"
                : "#EF4444",
            }}
          >
            <ClockIcon size={21} />
          </div>

          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: isOpen
                  ? "#22C55E"
                  : "#EF4444",
              }}
            >
              {isOpen
                ? "Recibiendo pedidos"
                : "No recibiendo pedidos"}
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                lineHeight: 1.4,
                color: "#A1A1AA",
              }}
            >
              {isOpen
                ? "El restaurante está disponible para recibir pedidos."
                : "El restaurante está cerrado y no recibe pedidos."}
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          marginTop: 22,
        }}
      >
        <div
          style={{
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#FFFFFF",
            }}
          >
            Horarios configurados
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#71717A",
            }}
          >
            Consulta el horario configurado para cada día.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 7,
          }}
        >
          {DAYS.map((day) => {
            const open = getTime(
              schedule,
              day.key,
              "open",
            );

            const close = getTime(
              schedule,
              day.key,
              "close",
            );

            const hasSchedule =
              Boolean(open && close);

            const expanded =
              openDay === day.key;

            return (
              <div
                key={day.key}
                style={{
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 14,
                  background: "#121212",
                  border:
                    "1px solid rgba(255,255,255,.06)",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDay(
                      expanded
                        ? null
                        : day.key,
                    )
                  }
                  aria-expanded={expanded}
                  style={{
                    width: "100%",
                    minHeight: 54,
                    padding: "0 15px",
                    border: "none",
                    background: "transparent",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    gap: 12,
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: "#FFFFFF",
                        }}
                      >
                        {day.label}
                      </div>

                      <div
                        style={{
                          marginTop: 3,
                          fontSize: 11,
                          color: hasSchedule
                            ? "#A1A1AA"
                            : "#71717A",
                        }}
                      >
                        {hasSchedule
                          ? `${formatTime(open)} – ${formatTime(close)}`
                          : "Cerrado"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: hasSchedule
                            ? "#22C55E"
                            : "#71717A",
                        }}
                      >
                        {hasSchedule
                          ? "Recibiendo"
                          : "Cerrado"}
                      </span>

                      <button
                        type="button"
                        aria-label={
                          hasSchedule
                            ? `Dejar de recibir pedidos el ${day.label}`
                            : `Reanudar recepción de pedidos el ${day.label}`
                        }
                        disabled={savingDay === day.key}
                        onClick={(event) => {
                          event.stopPropagation();

                          void toggleDayReceiving(
                            day.key,
                            hasSchedule,
                          );
                        }}
                        style={{
                          width: 36,
                          height: 20,
                          padding: 2,
                          boxSizing: "border-box",
                          border: "none",
                          borderRadius: 999,
                          background: hasSchedule
                            ? "#22C55E"
                            : "#3F3F46",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: hasSchedule
                            ? "flex-end"
                            : "flex-start",
                          transition:
                            "all 180ms ease",
                          cursor:
                            savingDay === day.key
                              ? "wait"
                              : "pointer",
                          opacity:
                            savingDay === day.key
                              ? 0.55
                              : 1,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            background: "#FFFFFF",
                            boxShadow:
                              "0 1px 3px rgba(0,0,0,.35)",
                          }}
                        />
                      </button>
                    </div>

                    <span
                      style={{
                        color: "#71717A",
                        fontSize: 17,
                        transform: expanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition:
                          "transform 180ms ease",
                      }}
                    >
                      ⌄
                    </span>
                  </div>
                </button>

                {expanded && (
                  <div
                    style={{
                      padding:
                        "0 15px 15px",
                    }}
                  >
                    <div
                      style={{
                        paddingTop: 12,
                        borderTop:
                          "1px solid rgba(255,255,255,.06)",
                        fontSize: 12,
                        lineHeight: 1.5,
                        color: "#A1A1AA",
                      }}
                    >
                      {hasSchedule
                        ? `Pedidos disponibles de ${formatTime(open)} a ${formatTime(close)}.`
                        : "Este día el restaurante permanece cerrado."}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}