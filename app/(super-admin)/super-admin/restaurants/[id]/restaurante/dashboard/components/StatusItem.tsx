"use client";

type Props = {
  title: string;
  subtitle: string;
  status: "online" | "offline" | "warning";
};

export default function StatusItem({
  title,
  subtitle,
  status,
}: Props) {
  const config = {
    online: {
      color: "#22c55e",
      label: "Online",
    },

    warning: {
      color: "#f59e0b",
      label: "Verificando",
    },

    offline: {
      color: "#ef4444",
      label: "Offline",
    },
  }[status];

  return (
    <article
      style={{
        position: "relative",

        overflow: "hidden",

        borderRadius: 22,

        padding: 22,

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
          "translateY(-4px)";

        e.currentTarget.style.boxShadow =
          "0 26px 60px rgba(0,0,0,.28)";
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

          top: -35,

          right: -35,

          width: 90,

          height: 90,

          borderRadius: "50%",

          background: `${config.color}20`,

          filter: "blur(22px)",
        }}
      />

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "flex-start",

          gap: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",

              fontWeight: 700,

              fontSize: 18,

              marginBottom: 8,
            }}
          >
            {title}
          </div>

          <div
            style={{
              color: "#969696",

              fontSize: 14,

              lineHeight: 1.7,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",

            alignItems: "center",

            gap: 8,

            padding: "8px 12px",

            borderRadius: 999,

            background: `${config.color}18`,

            border: `1px solid ${config.color}40`,

            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              width: 10,

              height: 10,

              borderRadius: "50%",

              background: config.color,

              boxShadow: `0 0 14px ${config.color}`,
            }}
          />

          <span
            style={{
              color: config.color,

              fontWeight: 700,

              fontSize: 13,
            }}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Barra inferior */}

      <div
        style={{
          marginTop: 22,

          height: 4,

          borderRadius: 999,

          background:
            "rgba(255,255,255,.05)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",

            height: "100%",

            borderRadius: 999,

            background: `linear-gradient(90deg,${config.color},transparent)`,
          }}
        />
      </div>
    </article>
  );
}