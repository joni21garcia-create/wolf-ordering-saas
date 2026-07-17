"use client";

import Link from "next/link";
import type { QuickAction } from "./types";

interface Props {
  actions: QuickAction[];
}

export default function SettingsQuickActions({ actions }: Props) {
  return (
    <section
      style={{
        marginBottom: 24,
      }}
    >
      {/* HEADER COMPACTO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "-0.2px",
          }}
        >
          Accesos Rápidos
        </h2>
        <span
          style={{
            color: "#8b8b95",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {actions.length} módulos
        </span>
      </div>

      {/* GRID DE FILAS COMPACTAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            style={{
              textDecoration: "none",
              display: "block",
            }}
          >
            <article
              style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 14,
                background: "linear-gradient(180deg,#171717,#0b0b0b)",
                border: "1px solid rgba(255,255,255,.06)",
                boxShadow: "0 4px 12px rgba(0,0,0,.1)",
                boxSizing: "border-box",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* Barra lateral de color distintivo */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: 3,
                  background: action.color,
                }}
              />

              {/* LADO IZQUIERDO: Icono y Título */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${action.color}15`,
                    border: `1px solid ${action.color}30`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 15,
                    color: action.color,
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </div>

                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      margin: 0,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {action.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#22c55e",
                      }}
                    />
                    <span
                      style={{
                        color: "#22c55e",
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      Disponible
                    </span>
                  </div>
                </div>
              </div>

              {/* FLECHA DERECHA */}
              <div
                style={{
                  color: action.color,
                  fontSize: 14,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}