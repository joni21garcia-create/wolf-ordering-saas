"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
};

export default function ExecutiveStatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        display: "flex",

        flexDirection: "column",

        justifyContent: "space-between",

        minHeight: 210,

        borderRadius: 28,

        padding: 28,

        background:
          "linear-gradient(180deg,#191919,#141414)",

        border:
          "1px solid rgba(255,255,255,.06)",

        boxShadow:
          "0 18px 45px rgba(0,0,0,.20)",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          top: -55,

          right: -55,

          width: 160,

          height: 160,

          borderRadius: "50%",

          background: `${color}20`,

          filter: "blur(34px)",
        }}
      />

      {/* Header */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color,

              fontSize: 13,

              fontWeight: 800,

              letterSpacing: 1.2,

              textTransform: "uppercase",
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 16,

              color: "#fff",

              fontSize: "clamp(34px,4vw,46px)",

              fontWeight: 900,

              lineHeight: 1,
            }}
          >
            {value}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 12,

                color: "#9d9d9d",

                fontSize: 14,

                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            width: 68,

            height: 68,

            borderRadius: 22,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            background:
              "rgba(255,255,255,.05)",

            border:
              "1px solid rgba(255,255,255,.08)",

            color,

            fontSize: 30,

            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
            {/* Footer */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          marginTop: 30,

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
          <span
            style={{
              width: 10,

              height: 10,

              borderRadius: "50%",

              background: color,

              boxShadow: `0 0 14px ${color}`,
            }}
          />

          <span
            style={{
              color: "#9b9b9b",

              fontSize: 13,

              fontWeight: 600,
            }}
          >
            Tiempo real
          </span>
        </div>

        <div
          style={{
            padding: "8px 14px",

            borderRadius: 999,

            background: `${color}18`,

            border: `1px solid ${color}40`,

            color,

            fontSize: 12,

            fontWeight: 700,

            letterSpacing: .5,
          }}
        >
          LIVE
        </div>
      </div>

      {/* Barra inferior */}

      <div
        style={{
          position: "absolute",

          left: 0,

          right: 0,

          bottom: 0,

          height: 5,

          background: `linear-gradient(90deg, ${color}, transparent)`,
        }}
      />
    </article>
  );
}