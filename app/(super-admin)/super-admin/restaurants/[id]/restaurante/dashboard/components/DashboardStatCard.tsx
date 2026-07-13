"use client";

type Props = {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
};

export default function DashboardStatCard({
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

        borderRadius: 26,

        background:
          "linear-gradient(180deg,#181818,#131313)",

        border:
          "1px solid rgba(255,255,255,.06)",

        padding: 26,

        transition: ".25s ease",

        boxShadow:
          "0 18px 45px rgba(0,0,0,.18)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-6px)";

        e.currentTarget.style.boxShadow =
          "0 30px 70px rgba(0,0,0,.28)";
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

          top: -45,

          right: -45,

          width: 120,

          height: 120,

          borderRadius: "50%",

          background: `${color}20`,

          filter: "blur(24px)",
        }}
      />

      {/* Icono */}

      <div
        style={{
          width: 60,

          height: 60,

          borderRadius: 18,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          fontSize: 28,

          background:
            "rgba(255,255,255,.05)",

          border:
            "1px solid rgba(255,255,255,.08)",

          marginBottom: 22,
        }}
      >
        {icon}
      </div>

      {/* Contenido */}

      <div
        style={{
          position: "relative",

          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "#909090",

            fontSize: 13,

            textTransform: "uppercase",

            letterSpacing: ".5px",

            marginBottom: 8,

            fontWeight: 600,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color,

            fontWeight: 800,

            fontSize: "clamp(28px,4vw,42px)",

            lineHeight: 1,
          }}
        >
          {value}
        </div>
                  <div
            style={{
              marginTop: 14,

              color: "#9b9b9b",

              fontSize: 14,

              lineHeight: 1.7,

              minHeight: 48,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Barra inferior */}

        <div
          style={{
            marginTop: 26,

            width: "100%",

            height: 5,

            borderRadius: 999,

            overflow: "hidden",

            background:
              "rgba(255,255,255,.05)",
          }}
        >
          <div
            style={{
              width: "100%",

              height: "100%",

              background: `linear-gradient(90deg,${color},transparent)`,

              borderRadius: 999,
            }}
          />
        </div>

        {/* Indicador */}

        <div
          style={{
            marginTop: 18,

            display: "flex",

            justifyContent:
              "space-between",

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
                color: "#7f7f7f",

                fontSize: 13,

                fontWeight: 600,
              }}
            >
              Actualizado ahora
            </span>
          </div>

          <span
            style={{
              color,

              fontSize: 18,

              fontWeight: 700,
            }}
          >
            →
          </span>
        </div>
    </article>
  );
}