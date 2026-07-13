"use client";

import type {
  OrdersBoardType,
} from "./types";

import {
  cardStyle,
  colors,
} from "./styles";

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

        padding: 10,

        marginBottom: 18,

        overflowX: "auto",

        display: "none",
      }}
    >
      <div
        style={{
          display: "flex",

          gap: 10,

          minWidth: "max-content",
        }}
      >
        {tabs.map((tab) => {
          const active =
            value === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() =>
                onChange(tab.id)
              }
              style={{
                border: "none",

                cursor: "pointer",

                padding:
                  "12px 18px",

                borderRadius: 14,

                whiteSpace:
                  "nowrap",

                fontWeight: 700,

                background: active
                  ? tab.color
                  : "#1f1f1f",

                color: "#fff",

                transition:
                  ".25s",
              }}
            >
              {tab.label}

              {" · "}

              {tab.total}
            </button>
          );
        })}
      </div>
    </section>
  );
}