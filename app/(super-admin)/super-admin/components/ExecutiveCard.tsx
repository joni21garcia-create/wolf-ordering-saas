"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: string;
  badge?: string;
};

export default function ExecutiveCard({
  title,
  description,
  icon,
  href,
  color,
  badge,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        display: "block",
        height: "100%",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article
        style={{
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Alinea arriba y abajo por separado
          height: "100%",
          minHeight: 220, // Altura balanceada y compacta
          borderRadius: 16, // Estilo industrial moderno
          padding: 20,
          background: "linear-gradient(180deg, #141414, #0d0d0d)",
          border: isHovered 
            ? `1px solid ${color}40` 
            : "1px solid rgba(255, 255, 255, 0.04)",
          boxShadow: isHovered 
            ? "0 12px 30px rgba(0, 0, 0, 0.4)" 
            : "0 4px 20px rgba(0, 0, 0, 0.2)",
          transform: isHovered ? "translateY(-4px)" : "translateY(0px)",
          transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Glow dinámico de fondo */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `${color}12`,
            filter: "blur(30px)",
            pointerEvents: "none",
            transform: isHovered ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* CONTENEDOR SUPERIOR */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {/* Contenedor del Icono */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `${color}10`,
                border: `1px solid ${color}25`,
                color,
                fontSize: 20,
              }}
            >
              {/* Forzamos un tamaño premium controlado al elemento hijo si es SVG */}
              <div style={{ display: "flex", transform: "scale(0.65)" }}>
                {icon}
              </div>
            </div>

            {/* Badge Miniaturizado */}
            {badge && (
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 999,
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  color: "#666666",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            )}
          </div>

          {/* Textos */}
          <h3
            style={{
              margin: "0 0 6px 0",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.3px",
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: 0,
              color: "#666666",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>

        {/* CONTENEDOR INFERIOR (FOOTER ALINEADO) */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.03)",
            paddingTop: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 8px ${color}`,
              }}
            />
            <span
              style={{
                color: isHovered ? "#fff" : "#444444",
                fontSize: 11,
                fontWeight: 600,
                transition: "color 0.2s ease",
              }}
            >
              Abrir módulo
            </span>
          </div>

          {/* Flecha minimalista tipo indicador */}
          <div
            style={{
              color: isHovered ? color : "#333",
              fontSize: 14,
              fontWeight: 700,
              transform: isHovered ? "translateX(2px)" : "translateX(0px)",
              transition: "all 0.2s ease",
            }}
          >
            →
          </div>
        </div>

        {/* Sutil barra de color inferior */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 2,
            background: isHovered 
              ? `linear-gradient(90deg, ${color}, transparent)` 
              : "transparent",
            transition: "background 0.3s ease",
          }}
        />
      </article>
    </Link>
  );
}


