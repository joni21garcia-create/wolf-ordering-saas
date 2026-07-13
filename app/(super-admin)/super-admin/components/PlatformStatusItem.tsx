"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
};

export default function PlatformStatusItem({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        borderRadius: 26,

        padding: 24,

        background:
          "linear-gradient(180deg,#1a1a1a 0%,#111111 100%)",

        border:
          "1px solid rgba(255,255,255,.06)",

        minHeight: 170,

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        transition: ".25s",

        cursor: "default",

        boxShadow:
          "0 12px 40px rgba(0,0,0,.18)",
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

          background: `${color}16`,

          filter: "blur(45px)",
        }}
      />

      {/* Cabecera */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 64,

            height: 64,

            borderRadius: 20,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            background: `${color}18`,

            border: `1px solid ${color}30`,

            color,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,

            padding: "7px 12px",

            borderRadius: 999,

            background: `${color}14`,

            border: `1px solid ${color}25`,
          }}
        >
          <span
            style={{
              width: 8,

              height: 8,

              borderRadius: "50%",

              background: color,

              boxShadow: `0 0 10px ${color}`,
            }}
          />

          <span
            style={{
              color,

              fontSize: 12,

              fontWeight: 700,
            }}
          >
            Activo
          </span>
        </div>
      </div>

      {/* Contenido */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          marginTop: 24,
        }}
      >
        <div
          style={{
            color: "#8d8d95",

            fontSize: 13,

            fontWeight: 700,

            letterSpacing: 1.3,

            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 12,

            color: "#fff",

            fontSize: 24,

            fontWeight: 900,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 10,

            color: "#8b8b95",

            fontSize: 14,

            lineHeight: 1.7,
          }}
        >
          Servicio operativo y monitoreado por el
          centro de control de Wolf Ordering SaaS.
        </div>
      </div>

      {/* Footer */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          marginTop: 26,

          display: "flex",

          justifyContent: "space-between",

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

              background: color,

              boxShadow: `0 0 12px ${color}`,
            }}
          />

          <span
            style={{
              color,

              fontWeight: 700,

              fontSize: 13,
            }}
          >
            Monitoreado
          </span>
        </div>

        <span
          style={{
            color,

            fontSize: 22,

            fontWeight: 800,
          }}
        >
          →
        </span>
      </div>

      {/* Barra inferior */}

      <div
        style={{
          position: "absolute",

          left: 0,

          right: 0,

          bottom: 0,

          height: 4,

          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
    </article>
  );
}