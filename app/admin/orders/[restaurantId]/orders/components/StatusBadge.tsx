"use client";

interface Props {
  status: string;
}

const STATUS = {
  pending: {
    label: "Pendiente",
    color: "#f59e0b",
  },

  accepted: {
    label: "Aceptado",
    color: "#3b82f6",
  },

  preparing: {
    label: "Preparando",
    color: "#ea580c",
  },

  ready: {
    label: "Listo",
    color: "#22c55e",
  },

  out_for_delivery: {
    label: "En camino",
    color: "#06b6d4",
  },

  completed: {
    label: "Completado",
    color: "#16a34a",
  },

  cancelled: {
    label: "Cancelado",
    color: "#ef4444",
  },
} as const;

export default function StatusBadge({
  status,
}: Props) {
  const current =
    STATUS[
      status as keyof typeof STATUS
    ] ?? {
      label: status,
      color: "#888",
    };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,

        padding: "8px 16px",

        borderRadius: 999,

        background: `${current.color}14`,

        border: `1px solid ${current.color}35`,

        color: current.color,

        fontWeight: 700,

        fontSize: 13,

        letterSpacing: ".2px",

        whiteSpace: "nowrap",

        backdropFilter: "blur(8px)",

        boxShadow: `0 0 18px ${current.color}15`,
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,

          borderRadius: "50%",

          background: current.color,

          boxShadow: `0 0 12px ${current.color}`,
        }}
      />

      {current.label}
    </span>
  );
}