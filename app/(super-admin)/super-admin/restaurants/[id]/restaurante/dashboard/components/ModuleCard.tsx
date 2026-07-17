"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
};

export default function ModuleCard({
  title,
  description,
  icon,
  href,
  color,
}: Props) {
  return (
    <>
      {/* ADAPTACIÓN MÓVIL PREMIUM CON MEDIA QUERIES */}
      <style jsx global>{`
        @media (max-width: 767px) {
          /* Contenedor colapsado a fila ultra limpia */
          .responsive-card {
            min-height: auto !important;
            padding: 10px 14px !important;
            border-radius: 14px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            box-shadow: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 12px !important;
          }

          /* Difuminado de esquina reducido para pantallas pequeñas */
          .responsive-glow {
            width: 70px !important;
            height: 70px !important;
            top: -25px !important;
            right: -25px !important;
            filter: blur(18px) !important;
          }

          /* Icono reducido y estilizado */
          .responsive-icon-box {
            width: 40px !important;
            height: 40px !important;
            border-radius: 10px !important;
            font-size: 18px !important;
            flex-shrink: 0 !important;
          }

          /* Alineación del bloque de texto principal */
          .responsive-body {
            margin-top: 0 !important;
            flex: 1 !important;
            min-width: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
          }

          .responsive-title {
            font-size: 15px !important;
            font-weight: 700 !important;
          }

          /* Ocultamos descripción para evitar scroll excesivo */
          .responsive-desc {
            display: none !important;
          }

          /* Ocultamos footer nativo de desktop */
          .responsive-footer {
            display: none !important;
          }

          /* Flecha compacta exclusiva de móviles */
          .mobile-arrow {
            display: flex !important;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.03);
            font-size: 11px;
            flex-shrink: 0;
            transition: transform 0.2s;
          }

          /* Línea decorativa inferior más delgada */
          .responsive-bottom-bar {
            height: 2px !important;
          }
        }

        /* Ocultar flecha móvil en escritorio */
        @media (min-width: 768px) {
          .mobile-arrow {
            display: none !important;
          }
        }
      `}</style>

      <Link
        href={href}
        style={{
          textDecoration: "none",
          display: "block",
          height: "100%",
        }}
      >
        <article
          className="responsive-card"
          style={{
            position: "relative",
            overflow: "hidden",
            height: "100%",
            minHeight: "clamp(180px,24vw,215px)",
            borderRadius: 24,
            padding: 24,
            background: "linear-gradient(180deg,#181818,#141414)",
            border: "1px solid rgba(255,255,255,.06)",
            transition: ".25s",
            boxShadow: "0 18px 45px rgba(0,0,0,.18)",
          }}
          onMouseEnter={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 28px 65px rgba(0,0,0,.30)";
            }
          }}
          onMouseLeave={(e) => {
            if (window.innerWidth >= 768) {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 18px 45px rgba(0,0,0,.18)";
            }
          }}
        >
          {/* Glow */}
          <div
            className="responsive-glow"
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `${color}20`,
              filter: "blur(25px)",
            }}
          />

          {/* Icono */}
          <div
            className="responsive-icon-box"
            style={{
              width: 58,
              height: 58,
              borderRadius: 18,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 28,
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {icon}
          </div>

          {/* Cuerpo */}
          <div
            className="responsive-body"
            style={{
              marginTop: 24,
              position: "relative",
              zIndex: 2,
            }}
          >
            <h3
              className="responsive-title"
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {title}
            </h3>

            <p
              className="responsive-desc"
              style={{
                marginTop: 12,
                color: "#9b9b9b",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {description}
            </p>

            {/* Footer Desktop */}
            <div
              className="responsive-footer"
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
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
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 12px ${color}`,
                  }}
                />
                <span
                  style={{
                    color: "#9c9c9c",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Abrir módulo
                </span>
              </div>

              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  color,
                  fontWeight: 700,
                  fontSize: 20,
                  transition: ".25s",
                }}
              >
                →
              </div>
            </div>
          </div>

          {/* Flecha móvil minimalista (con el tono de su propio módulo) */}
          <div className="mobile-arrow" style={{ zIndex: 2, color: color }}>
            ➔
          </div>

          {/* Barra inferior decorativa */}
          <div
            className="responsive-bottom-bar"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 5,
              background: `linear-gradient(90deg,${color},transparent)`,
            }}
          />
        </article>
      </Link>
    </>
  );
}