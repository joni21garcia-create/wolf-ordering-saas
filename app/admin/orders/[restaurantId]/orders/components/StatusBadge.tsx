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
    color: "#2563eb",
  },

  preparing: {
    label: "Preparando",
    color: "#ea580c",
  },

  ready: {
    label: "Listo",
    color: "#16a34a",
  },

  out_for_delivery: {
    label: "En camino",
    color: "#0891b2",
  },

  completed: {
    label: "Completado",
    color: "#22c55e",
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
        gap: 8,
        padding: "8px 14px",
        borderRadius: 999,
        background: `${current.color}18`,
        border: `1px solid ${current.color}35`,
        color: current.color,
        fontWeight: 700,
        fontSize: 13,
        whiteSpace: "nowrap",
      }}
    >
      ● {current.label}
    </span>
  );
}