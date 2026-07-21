"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
};

export default function ExecutiveStatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 150, // Altura súper optimizada y compacta
        borderRadius: 16, // Consistencia de diseño premium con las tarjetas de módulos
        padding: 18,
        background: "linear-gradient(180deg, #141414, #0d0d0d)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `${color}10`,
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              color,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 6,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            {value}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 6,
                color: "#666666",
                fontSize: 12,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Contenedor del Icono Sutil */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
            color,
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", transform: "scale(0.55)" }}>
            {icon}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
          paddingTop: 10,
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
              color: "#444444",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            Tiempo real
          </span>
        </div>

        <div
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            background: `${color}08`,
            border: `1px solid ${color}15`,
            color,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          LIVE
        </div>
      </div>

      {/* Sutil indicador inferior */}
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


