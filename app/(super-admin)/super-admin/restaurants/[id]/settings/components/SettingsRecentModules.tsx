"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type {
  SettingsModule,
} from "./types";

interface Props {
  modules: SettingsModule[];
}

const STORAGE_KEY =
  "wolf-settings-recent";

export default function SettingsRecentModules({
  modules,
}: Props) {
  const [recent, setRecent] =
    useState<SettingsModule[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          STORAGE_KEY
        ) ?? "[]"
      ) as string[];

      const list = saved
        .map((id) =>
          modules.find(
            (m) => m.id === id
          )
        )
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
        marginTop: 46,
        marginBottom: 40,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          marginBottom: 24,
        }}
      >
        <div>
          <div
            style={{
              color: "#3b82f6",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Historial
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize:
                "clamp(28px,4vw,36px)",
              fontWeight: 900,
            }}
          >
            Módulos Recientes
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#8b8b95",
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            Continúa trabajando donde
            lo dejaste. Los últimos
            módulos abiertos aparecen
            automáticamente aquí.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background:
              "rgba(255,255,255,.04)",
            border:
              "1px solid rgba(255,255,255,.08)",
            color: "#bdbdbd",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {recent.length} recientes
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(280px,1fr))",

          gap: 22,
        }}
      >
        {recent.map((module) => (
          <Link
            key={module.id}
            href={module.href}
            style={{
              textDecoration: "none",
            }}
          >
            <article
              style={{
                position: "relative",

                overflow: "hidden",

                height: "100%",

                padding: 24,

                borderRadius: 26,

                background:
                  "linear-gradient(180deg,#171717,#0b0b0b)",

                border:
                  "1px solid rgba(255,255,255,.07)",

                display: "flex",

                alignItems: "center",

                gap: 20,

                boxShadow:
                  "0 18px 45px rgba(0,0,0,.18)",

                transition: ".25s",
              }}
            >
              {/* Glow */}

              <div
                style={{
                  position: "absolute",

                  top: -40,

                  right: -40,

                  width: 120,

                  height: 120,

                  borderRadius: "50%",

                  background: `${module.color}18`,

                  filter: "blur(30px)",
                }}
              />

              {/* ICONO */}

              <div
                style={{
                  position: "relative",

                  zIndex: 2,

                  width: 68,

                  height: 68,

                  borderRadius: 20,

                  background: `${module.color}18`,

                  display: "flex",

                  justifyContent:
                    "center",

                  alignItems: "center",

                  fontSize: 30,

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

                    padding:
                      "5px 12px",

                    borderRadius: 999,

                    background: `${module.color}15`,

                    color: module.color,

                    fontWeight: 700,

                    fontSize: 12,

                    marginBottom: 14,
                  }}
                >
                  {module.category}
                </div>

                <h3
                  style={{
                    margin: 0,

                    color: "#fff",

                    fontWeight: 800,

                    fontSize: 20,
                  }}
                >
                  {module.title}
                </h3>

                <p
                  style={{
                    marginTop: 10,

                    color: "#8b8b95",

                    lineHeight: 1.7,

                    fontSize: 14,
                  }}
                >
                  Continúa configurando
                  este módulo desde el
                  último punto donde lo
                  utilizaste.
                </p>

                <div
                  style={{
                    marginTop: 16,

                    display: "flex",

                    alignItems:
                      "center",

                    gap: 8,

                    color: "#22c55e",

                    fontWeight: 700,

                    fontSize: 13,
                  }}
                >
                  <div
                    style={{
                      width: 8,

                      height: 8,

                      borderRadius: 999,

                      background:
                        "#22c55e",
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

                  fontSize: 24,

                  fontWeight: 800,
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

export function saveRecentModule(
  moduleId: string
) {
  try {
    const current = JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) ?? "[]"
    ) as string[];

    const updated = [
      moduleId,
      ...current.filter(
        (id) => id !== moduleId
      ),
    ].slice(0, 6);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );
  } catch {}
}