"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
};

export default function ModuleCard({
  title,
  description,
  icon,
  href,
  color,
}: Props) {
  return (
    <Link
      href={href}
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

          minHeight: "clamp(180px,24vw,215px)",

          borderRadius: 24,

          padding: 24,

          background:
            "linear-gradient(180deg,#181818,#141414)",

          border:
            "1px solid rgba(255,255,255,.06)",

          transition: ".25s",

          boxShadow:
            "0 18px 45px rgba(0,0,0,.18)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-6px)";

          e.currentTarget.style.boxShadow =
            "0 28px 65px rgba(0,0,0,.30)";
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

            top: -40,

            right: -40,

            width: 120,

            height: 120,

            borderRadius: "50%",

            background: `${color}20`,

            filter: "blur(25px)",
          }}
        />

        {/* Icono */}

        <div
          style={{
            width: 58,

            height: 58,

            borderRadius: 18,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            fontSize: 28,

            background:
              "rgba(255,255,255,.05)",

            border:
              "1px solid rgba(255,255,255,.08)",

            position: "relative",

            zIndex: 2,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            marginTop: 24,

            position: "relative",

            zIndex: 2,
          }}
        >
          <h3
            style={{
              margin: 0,

              color: "#fff",

              fontSize: 22,

              fontWeight: 800,

              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>

          <p
            style={{
              marginTop: 12,

              color: "#9b9b9b",

              fontSize: 14,

              lineHeight: 1.7,
            }}
          >
            {description}
          </p>
                    {/* Footer */}

          <div
            style={{
              marginTop: 24,

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              position: "relative",

              zIndex: 2,
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
                  width: 8,

                  height: 8,

                  borderRadius: "50%",

                  background: color,

                  boxShadow: `0 0 12px ${color}`,
                }}
              />

              <span
                style={{
                  color: "#9c9c9c",

                  fontSize: 13,

                  fontWeight: 600,
                }}
              >
                Abrir módulo
              </span>
            </div>

            <div
              style={{
                width: 42,

                height: 42,

                borderRadius: "50%",

                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                background: `${color}18`,

                border: `1px solid ${color}40`,

                color,

                fontWeight: 700,

                fontSize: 20,

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