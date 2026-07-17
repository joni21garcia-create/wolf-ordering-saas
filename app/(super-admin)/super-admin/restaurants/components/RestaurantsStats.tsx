"use client";

type Props = {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
};

export default function RestaurantsStats({
  total,
  active,
  inactive,
  newThisMonth,
}: Props) {
  const cards = [
    {
      title: "Restaurantes",
      value: total,
      icon: "🏪",
      color: "#ffffff",
      subtitle: "Registrados",
    },
    {
      title: "Activos",
      value: active,
      icon: "🟢",
      color: "#22c55e",
      subtitle: "Operando",
    },
    {
      title: "Inactivos",
      value: inactive,
      icon: "🔴",
      color: "#ef4444",
      subtitle: "Deshabilitados",
    },
    {
      title: "Nuevos",
      value: newThisMonth,
      icon: "🚀",
      color: "#ff8a1f",
      subtitle: "Este mes",
    },
  ];

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {cards.map((card) => (
        <article
          key={card.title}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,.06)",
            background: "#141414",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            transition: ".2s ease",
            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,.06)";
          }}
        >
          {/* Contenido principal */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                color: "#888",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".5px",
              }}
            >
              {card.title}
            </span>

            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: card.color,
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </div>

            <span
              style={{
                color: "#666",
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {card.subtitle}
            </span>
          </div>

          {/* Icono compacto */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
              flexShrink: 0,
            }}
          >
            {card.icon}
          </div>
        </article>
      ))}
    </section>
  );
}