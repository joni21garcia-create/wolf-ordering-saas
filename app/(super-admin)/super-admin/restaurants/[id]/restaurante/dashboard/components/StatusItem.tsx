"use client";

type Props = {
  title: string;
  subtitle: string;
  status: "online" | "offline" | "warning";
};

export default function StatusItem({
  title,
  subtitle,
  status,
}: Props) {
  const config = {
    online: {
      color: "#22c55e",
      label: "Online",
    },
    warning: {
      color: "#f59e0b",
      label: "Verificando",
    },
    offline: {
      color: "#ef4444",
      label: "Offline",
    },
  }[status];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 16px",
        borderRadius: 10,
        background: "rgba(255, 255, 255, 0.02)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Lado izquierdo: Título y descripción discretos en línea */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "#666",
            fontSize: 12,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          | {subtitle}
        </span>
      </div>

      {/* Lado derecho: El indicador luminoso compacto */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 8px",
          borderRadius: 6,
          background: `${config.color}08`,
          border: `1px solid ${config.color}20`,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: config.color,
            boxShadow: `0 0 8px ${config.color}`,
          }}
        />
        <span
          style={{
            color: config.color,
            fontWeight: 700,
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}