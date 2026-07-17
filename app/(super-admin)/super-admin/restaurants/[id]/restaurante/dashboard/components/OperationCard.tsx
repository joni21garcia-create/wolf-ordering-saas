"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
};

export default function OperationCard({
  title,
  description,
  icon,
  href,
  color,
  badge,
}: Props) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        display: "block",
        height: "100%",
      }}
    >
      <article
        style={{
          position: "relative",
          overflow: "hidden",
          height: "100%",
          // Reducido: De 240px-290px a un rango mucho más compacto y refinado
          minHeight: "clamp(160px, 20vw, 190px)",
          // Reducido: Bordes más sutiles de 18px en lugar de 30px
          borderRadius: 18,
          // Reducido: Padding interno optimizado para no desperdiciar espacio
          padding: 20,
          background: "linear-gradient(180deg,#1b1b1b,#141414)",
          border: "1px solid rgba(255,255,255,.06)",
          transition: ".28s ease",
          boxShadow: "0 12px 35px rgba(0,0,0,.18)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)"; // Animación más suave
          e.currentTarget.style.boxShadow = "0 22px 50px rgba(0,0,0,.28)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0,0,0,.18)";
        }}
      >
        {/* Glow (Escalado en proporción para no desbordar visualmente) */}
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: `${color}20`,
            filter: "blur(28px)",
          }}
        />

        {/* Badge (Paddings y fuentes más limpias y discretas) */}
        {badge && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              padding: "5px 10px",
              borderRadius: 999,
              background: `${color}18`,
              border: `1px solid ${color}40`,
              color,
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {badge}
          </div>
        )}

        {/* Icono (Reducido de 74px a un tamaño estándar de 48px súper estético) */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: 48,
            height: 48,
            borderRadius: 14,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(255,255,255,.05)",
            border: "1px solid rgba(255,255,255,.08)",
            color,
            fontSize: 22,
          }}
        >
          {icon}
        </div>

        {/* Bloque de Textos */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            marginTop: 16, // Reducido de 28px para compactar el diseño
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#fff",
              // Reducido: Tipografía de títulos mucho más moderna y menos invasiva
              fontSize: "clamp(18px, 2.2vw, 22px)",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              marginTop: 8, // Reducido de 16px para mantener la cohesión
              color: "#8e8e8e",
              fontSize: 13, // Reducido de 15px para mejorar legibilidad en bloques pequeños
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            {description}
          </p>

          {/* Footer (Optimizado con tamaños proporcionales) */}
          <div
            style={{
              marginTop: 20, // Reducido de 32px
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
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
                  width: 7, // Reducido de 10px
                  height: 7, // Reducido de 10px
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />

              <span
                style={{
                  color: "#8a8a8a",
                  fontSize: 12, // Reducido de 14px
                  fontWeight: 600,
                }}
              >
                Abrir módulo
              </span>
            </div>

            <div
              style={{
                width: 32, // Reducido de 48px
                height: 32, // Reducido de 48px
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: `${color}18`,
                border: `1px solid ${color}40`,
                color,
                fontSize: 15, // Reducido de 22px
                fontWeight: 700,
                transition: ".25s",
              }}
            >
              →
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 4, // Reducido de 5px para un look más "frameless"
            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      </article>
    </Link>
  );
}