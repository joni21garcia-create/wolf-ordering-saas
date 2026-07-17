"use client";

import Link from "next/link";

type Props = {
  title: string;
  icon: string | React.ReactNode; // Soportamos emojis (string) o componentes Lucide (ReactNode)
  href: string;
  color: string;
};

export default function QuickActionCard({
  title,
  icon,
  href,
  color,
}: Props) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        display: "block",
      }}
    >
      <article
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 14,
          padding: "16px 20px", // Mucho más compacto
          background: "linear-gradient(180deg, #141414, #0d0d0d)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.borderColor = `${color}35`;
          e.currentTarget.style.boxShadow = `0 10px 25px ${color}08`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Glow de esquina más discreto */}
        <div
          style={{
            position: "absolute",
            top: -25,
            right: -25,
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: `${color}12`,
            filter: "blur(18px)",
            pointerEvents: "none",
          }}
        />

        {/* Icono compacto y elegante */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: 44,
            height: 44,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 20,
            background: `${color}08`,
            border: `1px solid ${color}20`,
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Textos y Acción alineados */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            minWidth: 0,
          }}
        >
          {/* Título y descripción en línea */}
          <div style={{ minWidth: 0, paddingRight: 8 }}>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>
            <p
              style={{
                margin: "2px 0 0 0",
                color: "#606060",
                fontSize: 12,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Gestionar {title.toLowerCase()} del restaurante
            </p>
          </div>

          {/* Flecha de acción compacta */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              color: "#808080",
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            →
          </div>
        </div>

        {/* Barra de color inferior muy delgada */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      </article>
    </Link>
  );
}