"use client";

import Link from "next/link";
import type { SettingsModule } from "./types";

interface Props {
  module: SettingsModule;
}

export default function SettingsModuleCard({ module }: Props) {
  return (
    <Link
      href={module.href}
      style={{
        textDecoration: "none",
        display: "block",
        width: "100%",
      }}
    >
      <article
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(90deg, #181818 0%, #0d0d0d 100%)",
          border: "1px solid rgba(255,255,255,.07)",
          borderRadius: 20,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
          transition: ".2s ease",
          cursor: "pointer",
          boxSizing: "border-box",
          boxShadow: "0 8px 24px rgba(0,0,0,.15)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(4px)";
          e.currentTarget.style.borderColor = `${module.color}60`;
          e.currentTarget.style.boxShadow = `0 12px 30px ${module.color}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0px)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,.07)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.15)";
        }}
      >
        {/* Barra lateral de color distintivo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 4,
            background: module.color,
          }}
        />

        {/* LADO IZQUIERDO: Icono, Títulos y Descripción */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            flex: 1,
            minWidth: 0,
          }}
        >
          {/* ICONO */}
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 14,
              background: `${module.color}18`,
              border: `1px solid ${module.color}30`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: module.color,
              fontSize: 22,
              flexShrink: 0,
            }}
          >
            {module.icon}
          </div>

          {/* TEXTOS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2
                style={{
                  color: "#fff",
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  letterSpacing: "-0.3px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {module.title}
              </h2>

              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 99,
                  background: `${module.color}15`,
                  color: module.color,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                {module.category}
              </span>

              {module.featured && (
                <span
                  style={{
                    padding: "2px 8px",
                    borderRadius: 99,
                    background: `${module.color}20`,
                    border: `1px solid ${module.color}40`,
                    color: module.color,
                    fontWeight: 800,
                    fontSize: 10,
                  }}
                >
                  ⭐ Destacado
                </span>
              )}
            </div>

            <p
              style={{
                color: "#8d8d95",
                margin: 0,
                fontSize: 13,
                lineHeight: 1.4,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {module.description}
            </p>
          </div>
        </div>

        {/* LADO DERECHO: Estado y Flecha */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.2)",
              padding: "4px 10px",
              borderRadius: 99,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
              }}
            />
            <span
              style={{
                color: "#22c55e",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              Disponible
            </span>
          </div>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: `${module.color}18`,
              border: `1px solid ${module.color}35`,
              color: module.color,
              fontSize: 16,
              fontWeight: 800,
            }}
          >
            →
          </div>
        </div>
      </article>
    </Link>
  );
}