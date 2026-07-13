"use client";

import Link from "next/link";

import type {
  SettingsModule,
} from "./types";

interface Props {
  module: SettingsModule;
}

export default function SettingsModuleCard({
  module,
}: Props) {
  return (
    <Link
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

          background:
            "linear-gradient(180deg,#181818 0%,#0d0d0d 100%)",

          border:
            "1px solid rgba(255,255,255,.07)",

          borderRadius: 30,

          padding: 28,

          height: "100%",

          display: "flex",

          flexDirection: "column",

          justifyContent: "space-between",

          transition: ".28s ease",

          cursor: "pointer",

          boxSizing: "border-box",

          boxShadow:
            "0 18px 45px rgba(0,0,0,.22)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-8px)";

          e.currentTarget.style.boxShadow =
            "0 30px 70px rgba(0,0,0,.34)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 18px 45px rgba(0,0,0,.22)";
        }}
      >
        {/* Glow */}

        <div
          style={{
            position: "absolute",
            top: -70,
            right: -70,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `${module.color}22`,
            filter: "blur(42px)",
          }}
        />

        {/* Barra superior */}

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: `linear-gradient(90deg, ${module.color}, transparent)`,
          }}
        />

        {/* CABECERA */}

        <div
          style={{
            position: "relative",
            zIndex: 2,

            display: "flex",

            justifyContent: "space-between",

            alignItems: "flex-start",

            gap: 18,

            marginBottom: 26,
          }}
        >
          <div
            style={{
              width: 76,

              height: 76,

              borderRadius: 24,

              background: `${module.color}18`,

              border: `1px solid ${module.color}30`,

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              color: module.color,

              fontSize: 34,

              flexShrink: 0,
            }}
          >
            {module.icon}
          </div>

          {module.featured && (
            <div
              style={{
                padding: "8px 15px",

                borderRadius: 999,

                background: `${module.color}18`,

                border: `1px solid ${module.color}40`,

                color: module.color,

                fontWeight: 800,

                fontSize: 12,

                letterSpacing: .5,

                whiteSpace: "nowrap",
              }}
            >
              ⭐ Destacado
            </div>
          )}
        </div>

        {/* CONTENIDO */}

        <div
          style={{
            position: "relative",
            zIndex: 2,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              padding: "7px 13px",

              borderRadius: 999,

              background: `${module.color}15`,

              color: module.color,

              fontWeight: 700,

              fontSize: 12,

              marginBottom: 18,
            }}
          >
            {module.category}
          </div>

          <h2
            style={{
              color: "#fff",

              margin: 0,

              fontSize: 28,

              fontWeight: 900,

              lineHeight: 1.2,
            }}
          >
            {module.title}
          </h2>

          <p
            style={{
              color: "#8d8d95",

              marginTop: 16,

              lineHeight: 1.8,

              fontSize: 15,

              minHeight: 55,
            }}
          >
            {module.description}
          </p>
        </div>

        {/* FOOTER */}

        <div
          style={{
            position: "relative",
            zIndex: 2,

            marginTop: 34,

            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",

              alignItems: "center",

              gap: 12,
            }}
          >
            <span
              style={{
                width: 10,

                height: 10,

                borderRadius: "50%",

                background: "#22c55e",

                boxShadow:
                  "0 0 12px #22c55e",
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

          <div
            style={{
              width: 48,

              height: 48,

              borderRadius: "50%",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              background: `${module.color}18`,

              border: `1px solid ${module.color}35`,

              color: module.color,

              fontSize: 22,

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