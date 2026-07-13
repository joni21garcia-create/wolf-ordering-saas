"use client";

import Link from "next/link";

type Props = {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  badge?: string;
};

export default function OperationCard({
  title,
  description,
  icon,
  href,
  color,
  badge,
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

          minHeight: "clamp(240px,28vw,290px)",

          borderRadius: 30,

          padding: 30,

          background:
            "linear-gradient(180deg,#1b1b1b,#141414)",

          border:
            "1px solid rgba(255,255,255,.06)",

          transition: ".28s ease",

          boxShadow:
            "0 20px 60px rgba(0,0,0,.22)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-8px)";

          e.currentTarget.style.boxShadow =
            "0 35px 80px rgba(0,0,0,.30)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 20px 60px rgba(0,0,0,.22)";
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

            background: `${color}20`,

            filter: "blur(38px)",
          }}
        />

        {/* Badge */}

        {badge && (
          <div
            style={{
              position: "absolute",

              top: 24,

              right: 24,

              padding: "8px 14px",

              borderRadius: 999,

              background: `${color}18`,

              border: `1px solid ${color}40`,

              color,

              fontSize: 13,

              fontWeight: 700,
            }}
          >
            {badge}
          </div>
        )}

        {/* Icono */}

        <div
          style={{
            position: "relative",

            zIndex: 2,

            width: 74,

            height: 74,

            borderRadius: 22,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            background:
              "rgba(255,255,255,.05)",

            border:
              "1px solid rgba(255,255,255,.08)",

            color,

            fontSize: 34,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            position: "relative",

            zIndex: 2,

            marginTop: 28,
          }}
        >
          <h2
            style={{
              margin: 0,

              color: "#fff",

              fontSize: "clamp(28px,3vw,36px)",

              fontWeight: 800,

              lineHeight: 1.15,
            }}
          >
            {title}
          </h2>

          <p
            style={{
              marginTop: 16,

              color: "#9a9a9a",

              fontSize: 15,

              lineHeight: 1.9,

              maxWidth: 520,
            }}
          >
            {description}
          </p>
                    {/* Footer */}

          <div
            style={{
              marginTop: 32,

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              gap: 16,
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
                  color: "#a0a0a0",

                  fontSize: 14,

                  fontWeight: 600,
                }}
              >
                Abrir módulo
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

            background: `linear-gradient(90deg, ${color}, transparent)`,
          }}
        />
      </article>
    </Link>
  );
}