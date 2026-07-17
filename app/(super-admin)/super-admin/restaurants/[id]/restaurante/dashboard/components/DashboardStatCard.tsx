"use client";

type Props = {
  title: string;
  value: string | number;
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
        borderRadius: 12,
        background: "linear-gradient(180deg, #161616, #0f0f0f)",
        border: "1px solid rgba(255, 255, 255, .04)",
        padding: "12px 16px", // Mucho más compacto
        transition: "all .2s ease",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, .08)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, .04)";
        e.currentTarget.style.transform = "translateY(0px)";
      }}
    >
      {/* Sutil brillo de fondo */}
      <div
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: `${color}10`,
          filter: "blur(15px)",
          pointerEvents: "none",
        }}
      />

      {/* Icono compacto */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 16,
          background: "rgba(255, 255, 255, .03)",
          border: "1px solid rgba(255, 255, 255, .05)",
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Textos ordenados para no ocupar espacio vertical */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <span
          style={{
            color: "#606060",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontWeight: 800,
            display: "block",
            marginBottom: 2,
          }}
        >
          {title}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span
            style={{
              color: "#fff", // Blanco para un look más integrado y menos "chillón"
              fontWeight: 700,
              fontSize: 18, // Mucho más discreto
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          <span
            style={{
              color: "#808080",
              fontSize: 11,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            • {subtitle}
          </span>
        </div>
      </div>
    </article>
  );
}