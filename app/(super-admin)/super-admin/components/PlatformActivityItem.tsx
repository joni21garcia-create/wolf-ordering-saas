"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
  color: string;
};

export default function PlatformActivityItem({
  title,
  description,
  time,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 16px",
        borderRadius: 12, // Consistencia absoluta con OverviewCard
        background: "linear-gradient(180deg, #141414, #0d0d0d)",
        border: "1px solid rgba(255, 255, 255, 0.04)",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: `${color}08`,
          filter: "blur(22px)",
          pointerEvents: "none",
        }}
      />

      {/* Contenedor de Icono Premium */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
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

      {/* Información */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.2px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: 4,
            marginBottom: 8,
            color: "#666666",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          {description}
        </p>

        {/* Timestamp */}
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
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {time}
          </span>
        </div>
      </div>

      {/* Sutil barra de color inferior */}
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


