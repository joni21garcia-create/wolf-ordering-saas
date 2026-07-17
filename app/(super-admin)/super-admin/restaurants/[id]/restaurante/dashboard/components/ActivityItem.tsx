"use client";

type Props = {
  title: string;
  description: string;
  time: string;
};

export default function ActivityItem({
  title,
  description,
  time,
}: Props) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "12px 16px", // Compacto y optimizado para listas
        borderRadius: 10,
        background: "rgba(255, 255, 255, 0.01)",
        border: "1px solid rgba(255, 255, 255, 0.03)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.03)";
      }}
    >
      {/* Indicador de Timeline Miniaturizado */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "stretch", // Hace que la línea vertical ocupe todo el alto real
          flexShrink: 0,
          paddingTop: 5,
        }}
      >
        <div
          style={{
            width: 6, // Burbuja diminuta y elegante
            height: 6,
            borderRadius: "50%",
            background: "#f97316",
            boxShadow: "0 0 6px rgba(249, 115, 22, 0.6)",
          }}
        />
        <div
          style={{
            width: 1,
            flex: 1,
            marginTop: 6,
            background: "linear-gradient(rgba(249, 115, 22, 0.15), transparent)",
          }}
        />
      </div>

      {/* Información principal */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <h5
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            {title}
          </h5>

          <p
            style={{
              marginTop: 2,
              marginBottom: 0,
              color: "#808080",
              lineHeight: 1.4,
              fontSize: 12,
            }}
          >
            {description}
          </p>
        </div>

        {/* Timestamp sutil tipo badge */}
        <div
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            background: "rgba(249, 115, 22, 0.05)",
            border: "1px solid rgba(249, 115, 22, 0.12)",
            color: "#f97316",
            fontWeight: 600,
            fontSize: 10,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {time}
        </div>
      </div>
    </article>
  );
}