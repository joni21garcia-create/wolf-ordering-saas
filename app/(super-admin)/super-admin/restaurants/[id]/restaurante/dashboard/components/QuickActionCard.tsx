"use client";

import Link from "next/link";

type Props = {
  title: string;
  icon: string;
  href: string;
  color: string;
};

export default function QuickActionCard({
  title,
  icon,
  href,
  color,
}: Props) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      <article
        style={{
          position: "relative",

          overflow: "hidden",

          display: "flex",

          flexDirection: "column",

          justifyContent: "space-between",

          minHeight: 215,

          borderRadius: 28,

          padding: 28,

          background:
            "linear-gradient(180deg,#191919,#141414)",

          border:
            "1px solid rgba(255,255,255,.06)",

          transition: ".25s ease",

          boxShadow:
            "0 18px 45px rgba(0,0,0,.18)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-8px)";

          e.currentTarget.style.boxShadow =
            "0 32px 70px rgba(0,0,0,.30)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 18px 45px rgba(0,0,0,.18)";
        }}
      >
        {/* Glow */}

        <div
          style={{
            position: "absolute",

            top: -55,

            right: -55,

            width: 150,

            height: 150,

            borderRadius: "50%",

            background: `${color}20`,

            filter: "blur(30px)",
          }}
        />

        {/* Icono */}

        <div
          style={{
            position: "relative",

            zIndex: 2,

            width: 68,

            height: 68,

            borderRadius: 22,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            fontSize: 34,

            background:
              "rgba(255,255,255,.05)",

            border:
              "1px solid rgba(255,255,255,.08)",
          }}
        >
          {icon}
        </div>

 <div
  style={{
    position: "relative",
    zIndex: 2,
    marginTop: 30,
  }}
>
  <h3
    style={{
      margin: 0,
      color: "#fff",
      fontSize: 24,
      fontWeight: 800,
      lineHeight: 1.2,
    }}
  >
    {title}
  </h3>

  <p
    style={{
      marginTop: 12,
      marginBottom: 0,
      color: "#9d9d9d",
      fontSize: 15,
      lineHeight: 1.7,
    }}
  >
    Accede rápidamente al módulo de{" "}
    {title.toLowerCase()}.
  </p>

  {/* Footer */}

  <div
    style={{
      position: "relative",
      zIndex: 2,
      marginTop: 28,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      />

      <span
        style={{
          color: "#9b9b9b",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Abrir módulo
      </span>
    </div>

    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
        fontSize: 22,
        fontWeight: 700,
        transition: ".25s",
      }}
    >
      →
    </div>
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
    background: `linear-gradient(90deg,${color},transparent)`,
  }}
/>

      </article>
    </Link>
  );
}