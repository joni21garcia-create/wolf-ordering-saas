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
        gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",

        gap: 24,

        marginBottom: 34,
      }}
    >
      {cards.map((card) => (
        <article
          key={card.title}
          style={{
            position: "relative",

            overflow: "hidden",

            borderRadius: 24,

            border:
              "1px solid rgba(255,255,255,.06)",

            background:
              "linear-gradient(180deg,#181818,#131313)",

            padding: 24,

            display: "flex",

            flexDirection: "column",

            gap: 20,

            transition:
              ".25s ease",

            boxShadow:
              "0 15px 40px rgba(0,0,0,.18)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-5px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px)";
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

              background: `${card.color}20`,

              filter: "blur(20px)",
            }}
          />

          {/* Icono */}

          <div
            style={{
              width: 58,

              height: 58,

              borderRadius: 18,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 28,

              background:
                "rgba(255,255,255,.05)",

              border:
                "1px solid rgba(255,255,255,.06)",
            }}
          >
            {card.icon}
          </div>

          {/* Contenido */}

          <div>
            <div
              style={{
                color: "#9a9a9a",

                fontSize: 13,

                marginBottom: 8,

                fontWeight: 600,

                textTransform:
                  "uppercase",

                letterSpacing: ".5px",
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 42,

                fontWeight: 800,

                color: card.color,

                lineHeight: 1,
              }}
            >
              {card.value}
            </div>
                        <div
              style={{
                marginTop: 10,

                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",
              }}
            >
              <span
                style={{
                  color: "#7d7d7d",

                  fontSize: 13,

                  fontWeight: 500,
                }}
              >
                {card.subtitle}
              </span>

              <div
                style={{
                  width: 46,

                  height: 6,

                  borderRadius: 999,

                  background:
                    "rgba(255,255,255,.06)",

                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "100%",

                    height: "100%",

                    borderRadius: 999,

                    background:
                      card.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Línea inferior */}

          <div
            style={{
              marginTop: "auto",

              height: 4,

              borderRadius: 999,

              background:
                "linear-gradient(90deg," +
                card.color +
                ",transparent)",
            }}
          />
        </article>
      ))}
    </section>
  );
}