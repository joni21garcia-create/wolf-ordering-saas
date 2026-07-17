"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
};

export default function PlatformStatusItem({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 12,
        padding: 16,
        background: "linear-gradient(180deg, #141414 0%, #0d0d0d 100%)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Glow Suave */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `${color}08`,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Cabecera */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: `${color}12`,
            border: `1px solid ${color}25`,
            color,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", transform: "scale(0.6)" }}>
            {icon}
          </div>
        </div>

        {/* Badge de Estatus Compacto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            borderRadius: 999,
            background: `${color}10`,
            border: `1px solid ${color}20`,
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              color,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            Activo
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "#666666",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 4,
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "-0.2px",
          }}
        >
          {value}
        </div>

        <p
          style={{
            margin: "6px 0 0 0",
            color: "#666666",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          Servicio operativo y monitoreado por el centro de control.
        </p>
      </div>

      {/* Footer Indicador */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 14,
          paddingTop: 10,
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 6px ${color}`,
            }}
          />
          <span
            style={{
              color: "#555555",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Monitoreado 24/7
          </span>
        </div>

        <span
          style={{
            color,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          →
        </span>
      </div>

      {/* Barra inferior decorativa */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1.5,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
    </article>
  );
}