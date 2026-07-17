"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
};

export default function OverviewCard({
  title,
  subtitle,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
        padding: "16px 20px",
        background: "linear-gradient(135deg, rgba(25, 25, 30, 0.7) 0%, rgba(12, 12, 15, 0.9) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        transition: "all 0.25s ease",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: `${color}15`,
          filter: "blur(25px)",
          pointerEvents: "none",
        }}
      />

      {/* Contenedor de Icono Premium */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: `${color}12`,
          border: `1px solid ${color}30`,
          color,
          flexShrink: 0,
          boxShadow: `0 0 15px ${color}10`,
        }}
      >
        <div style={{ display: "flex", transform: "scale(0.65)" }}>
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
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.3px",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: 4,
            marginBottom: 0,
            color: "#94a3b8",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {subtitle ?? "Disponible en la plataforma."}
        </p>
      </div>

      {/* Sutil barra de color inferior */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
    </article>
  );
}