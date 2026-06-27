"use client";

interface Props {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export default function OpenStatus({
  isOpen,
  openTime,
  closeTime,
}: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: "6px",
        padding: "14px 18px",
        borderRadius: "18px",
        marginBottom: "24px",
        background: isOpen
          ? "rgba(34,197,94,.15)"
          : "rgba(239,68,68,.15)",
        border: isOpen
          ? "1px solid rgba(34,197,94,.25)"
          : "1px solid rgba(239,68,68,.25)",
        backdropFilter: "blur(12px)",
      }}
    >
      <strong
        style={{
          color: isOpen
            ? "#22c55e"
            : "#ef4444",
          fontSize: "15px",
        }}
      >
        {isOpen
          ? "🟢 Abierto Ahora"
          : "🔴 Cerrado"}
      </strong>

      <span
        style={{
          color: "#fff",
          fontSize: "14px",
        }}
      >
        Horario de hoy:
        {" "}
        {openTime}
        {" - "}
        {closeTime}
      </span>
    </div>
  );
}