"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
  color: string;
};

export default function PlatformActivityItem({
  title,
  description,
  time,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        display: "flex",

        alignItems: "flex-start",

        gap: 18,

        padding: 22,

        borderRadius: 22,

        background:
          "linear-gradient(180deg,#1a1a1a,#141414)",

        border:
          "1px solid rgba(255,255,255,.06)",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          top: -40,

          right: -40,

          width: 110,

          height: 110,

          borderRadius: "50%",

          background: `${color}18`,

          filter: "blur(28px)",
        }}
      />

      {/* Icono */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          width: 54,

          height: 54,

          borderRadius: 18,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          background:
            "rgba(255,255,255,.05)",

          border:
            "1px solid rgba(255,255,255,.08)",

          color,

          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Información */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,

            color: "#fff",

            fontSize: 17,

            fontWeight: 700,
          }}
        >
          {title}
        </h3>

        <p
          style={{
            marginTop: 10,

            marginBottom: 12,

            color: "#9b9b9b",

            fontSize: 14,

            lineHeight: 1.7,
          }}
        >
          {description}
        </p>

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 10,
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
              color: "#8f8f8f",

              fontSize: 13,

              fontWeight: 600,
            }}
          >
            {time}
          </span>
        </div>
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