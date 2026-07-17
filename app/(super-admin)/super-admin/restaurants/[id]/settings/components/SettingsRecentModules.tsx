"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SettingsModule } from "./types";

interface Props {
  modules: SettingsModule[];
}

const STORAGE_KEY = "wolf-settings-recent";

export default function SettingsRecentModules({ modules }: Props) {
  const [recent, setRecent] = useState<SettingsModule[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "[]"
      ) as string[];

      const list = saved
        .map((id) => modules.find((m) => m.id === id))
        .filter(Boolean) as SettingsModule[];

      setRecent(list);
    } catch {}
  }, [modules]);

  if (recent.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginTop: 40,
        marginBottom: 36,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              color: "#3b82f6",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Historial
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(26px, 4vw, 34px)",
              fontWeight: 900,
              letterSpacing: "-0.5px",
            }}
          >
            Módulos Recientes
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b95",
              lineHeight: 1.6,
              maxWidth: 680,
              fontSize: 14,
            }}
          >
            Continúa trabajando donde lo dejaste. Los últimos módulos abiertos aparecen automáticamente aquí.
          </p>
        </div>

        <div
          style={{
            padding: "8px 16px",
            borderRadius: 99,
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.06)",
            color: "#bdbdbd",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          {recent.length} recientes
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 18,
        }}
      >
        {recent.map((module) => (
          <Link
            key={module.id}
            href={module.href}
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
                padding: 24,
                borderRadius: 24,
                background: "linear-gradient(180deg,#171717,#0b0b0b)",
                border: "1px solid rgba(255,255,255,.06)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                boxShadow: "0 15px 35px rgba(0,0,0,.15)",
                boxSizing: "border-box",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* Glow decorativo sutil */}
              <div
                style={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 130,
                  height: 130,
                  borderRadius: "50%",
                  background: `${module.color}12`,
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              {/* ICONO */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: `${module.color}15`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 26,
                  flexShrink: 0,
                }}
              >
                {module.icon}
              </div>

              {/* CONTENIDO */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: "4px 10px",
                    borderRadius: 99,
                    background: `${module.color}12`,
                    color: module.color,
                    fontWeight: 700,
                    fontSize: 11,
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {module.category}
                </div>

                <h3
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 18,
                    letterSpacing: "-0.3px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {module.title}
                </h3>

                <p
                  style={{
                    margin: "6px 0 0 0",
                    color: "#8b8b95",
                    lineHeight: 1.5,
                    fontSize: 13,
                  }}
                >
                  Continúa configurando este módulo desde el último punto.
                </p>

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#22c55e",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 99,
                      background: "#22c55e",
                    }}
                  />
                  Disponible
                </div>
              </div>

              {/* Flecha */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  color: module.color,
                  fontSize: 20,
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

/*
=========================================================
UTILIDAD
=========================================================
*/

export function saveRecentModule(moduleId: string) {
  try {
    const current = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "[]"
    ) as string[];

    const updated = [
      moduleId,
      ...current.filter((id) => id !== moduleId),
    ].slice(0, 6);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}