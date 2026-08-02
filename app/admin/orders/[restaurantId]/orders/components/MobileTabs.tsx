"use client";

import type { OrdersBoardType } from "./types";

import { cardStyle, colors } from "./styles";

interface Props {
  value:
    | "pending"
    | "preparing"
    | "ready"
    | "completed";

  board: OrdersBoardType;

  onChange: (
    value:
      | "pending"
      | "preparing"
      | "ready"
      | "completed"
  ) => void;
}

export default function MobileTabs({
  value,
  board,
  onChange,
}: Props) {
  const tabs = [
    {
      id: "pending",
      label: "Pendientes",
      total: board.pending.length,
      color: "#f97316",
    },
    {
      id: "preparing",
      label: "Preparación",
      total:
        board.accepted.length +
        board.preparing.length,
      color: "#3b82f6",
    },
    {
      id: "ready",
      label: "Listos",
      total:
        board.ready.length +
        board.delivery.length,
      color: "#22c55e",
    },
    {
      id: "completed",
      label: "Finalizados",
      total: board.completed.length,
      color: "#71717a",
    },
  ] as const;

  return (
    <section
      className="orders-mobile-tabs"
      style={{
        ...cardStyle,

        padding: 12,

        marginBottom: 20,

        display: "none",

        overflowX: "auto",

        borderRadius: 22,

        border:
          "1px solid rgba(255,255,255,.05)",

        background:
          "linear-gradient(180deg,#171717,#101010)",

        boxShadow:
          "0 15px 35px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          minWidth: "max-content",
        }}
      >
        {tabs.map((tab) => {
          const active = value === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() =>
                onChange(tab.id)
              }
              style={{
                display: "flex",

                alignItems: "center",

                gap: 10,

                padding: "12px 18px",

                borderRadius: 16,

                border: active
                  ? `1px solid ${tab.color}`
                  : "1px solid rgba(255,255,255,.05)",

                background: active
                  ? `linear-gradient(180deg,${tab.color},${tab.color}cc)`
                  : "#1b1b1b",

                color: "#fff",

                cursor: "pointer",

                whiteSpace: "nowrap",

                fontWeight: 700,

                transition: ".25s",

                boxShadow: active
                  ? `0 0 20px ${tab.color}40`
                  : "none",
              }}
            >
              <span>{tab.label}</span>

              <span
                style={{
                  minWidth: 28,

                  height: 28,

                  padding: "0 10px",

                  borderRadius: 999,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  fontSize: 13,

                  fontWeight: 800,

                  background: active
                    ? "rgba(255,255,255,.18)"
                    : `${tab.color}22`,

                  color: active
                    ? "#fff"
                    : tab.color,
                }}
              >
                {tab.total}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}