"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  color: string;
};

export default function OverviewCard({
  title,
  subtitle,
  icon,
  color,
}: Props) {
  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        borderRadius: 22,

        padding: 22,

        background:
          "linear-gradient(180deg,#1a1a1a,#141414)",

        border:
          "1px solid rgba(255,255,255,.06)",

        display: "flex",

        alignItems: "center",

        gap: 18,

        transition: ".25s ease",
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

      <div
        style={{
          position: "relative",

          zIndex: 2,

          width: 58,

          height: 58,

          borderRadius: 18,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          background:
            "rgba(255,255,255,.05)",

          border:
            "1px solid rgba(255,255,255,.08)",

          color,
        }}
      >
        {icon}
      </div>

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
    marginTop: 8,
    marginBottom: 0,
    color: "#9b9b9b",
    fontSize: 14,
    lineHeight: 1.6,
  }}
>
  {subtitle ?? "Disponible en la plataforma."}
</p>
      </div>

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