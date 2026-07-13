"use client";

import Link from "next/link";

import type {
  QuickAction,
} from "./types";

interface Props {
  actions: QuickAction[];
}

export default function SettingsQuickActions({
  actions,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 42,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              color: "#f97316",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Centro Ejecutivo
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(28px,4vw,38px)",
              fontWeight: 900,
            }}
          >
            Accesos Rápidos
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#8d8d95",
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            Accede rápidamente a los módulos más
            utilizados del restaurante para agilizar
            tu administración diaria.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "#bdbdbd",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {actions.length} accesos
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",

          gap: 22,
        }}
      >
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            style={{
              textDecoration: "none",
            }}
          >
            <article
              style={{
                position: "relative",

                overflow: "hidden",

                height: "100%",

                display: "flex",

                flexDirection: "column",

                justifyContent: "space-between",

                gap: 22,

                padding: 24,

                borderRadius: 26,

                background:
                  "linear-gradient(180deg,#171717,#0b0b0b)",

                border:
                  "1px solid rgba(255,255,255,.07)",

                transition: ".25s",

                boxShadow:
                  "0 18px 45px rgba(0,0,0,.18)",
              }}
            >
              {/* Glow */}

              <div
                style={{
                  position: "absolute",

                  top: -40,

                  right: -40,

                  width: 130,

                  height: 130,

                  borderRadius: "50%",

                  background: `${action.color}18`,

                  filter: "blur(30px)",
                }}
              />

              {/* ICONO */}

              <div
                style={{
                  position: "relative",

                  zIndex: 2,

                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 66,

                    height: 66,

                    borderRadius: 20,

                    background: `${action.color}18`,

                    display: "flex",

                    justifyContent: "center",

                    alignItems: "center",

                    fontSize: 30,
                  }}
                >
                  {action.icon}
                </div>

                <div
                  style={{
                    width: 12,

                    height: 12,

                    borderRadius: 999,

                    background: action.color,

                    boxShadow: `0 0 14px ${action.color}`,
                  }}
                />
              </div>

              {/* CONTENIDO */}

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",

                    padding: "6px 12px",

                    borderRadius: 999,

                    background: `${action.color}15`,

                    color: action.color,

                    fontWeight: 700,

                    fontSize: 12,

                    marginBottom: 16,
                  }}
                >
                  Acción rápida
                </div>

                <h3
                  style={{
                    margin: 0,

                    color: "#fff",

                    fontWeight: 800,

                    fontSize: 22,
                  }}
                >
                  {action.title}
                </h3>

                <p
                  style={{
                    marginTop: 14,

                    color: "#8b8b95",

                    fontSize: 14,

                    lineHeight: 1.7,
                  }}
                >
                  Accede directamente al módulo y
                  continúa administrando tu
                  restaurante sin navegar por todo
                  el panel.
                </p>
              </div>

              {/* FOOTER */}

              <div
                style={{
                  position: "relative",

                  zIndex: 2,

                  display: "flex",

                  justifyContent:
                    "space-between",

                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",

                    alignItems: "center",

                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,

                      height: 10,

                      borderRadius: 999,

                      background: "#22c55e",
                    }}
                  />

                  <span
                    style={{
                      color: "#22c55e",

                      fontWeight: 700,

                      fontSize: 13,
                    }}
                  >
                    Disponible
                  </span>
                </div>

                <span
                  style={{
                    color: action.color,

                    fontSize: 24,

                    fontWeight: 800,
                  }}
                >
                  →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}