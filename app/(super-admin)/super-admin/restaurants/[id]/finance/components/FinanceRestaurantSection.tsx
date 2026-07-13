"use client";

interface Props {
  today: number;
  week: number;
  month: number;
}

export default function FinanceRestaurantSection({
  today,
  week,
  month,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 42,
      }}
    >
      <Header />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 18,
        }}
      >
        <RestaurantCard
          title="Hoy"
          value={today}
          subtitle="Ganancia del restaurante hoy"
        />

        <RestaurantCard
          title="Semana"
          value={week}
          subtitle="Ganancia acumulada semanal"
        />

        <RestaurantCard
          title="Mes"
          value={month}
          subtitle="Ganancia acumulada mensual"
          featured
        />
      </div>
    </section>
  );
}

function Header() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
        marginBottom: 22,
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
          }}
        >
          🏪 Ganancia del Restaurante
        </h2>

        <p
          style={{
            marginTop: 8,
            color: "#8b8b8b",
          }}
        >
          Ingresos correspondientes al restaurante.
        </p>
      </div>

      <div
        style={{
          padding: "10px 18px",
          borderRadius: 999,
          background:
            "rgba(34,197,94,.12)",

          color: "#22c55e",

          border:
            "1px solid rgba(34,197,94,.20)",

          fontWeight: 700,
        }}
      >
        Restaurant Revenue
      </div>
    </div>
  );
}

function RestaurantCard({
  title,
  value,
  subtitle,
  featured,
}: {
  title: string;
  value: number;
  subtitle: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        background: featured
          ? "linear-gradient(135deg,#22c55e,#15803d)"
          : "linear-gradient(180deg,#171717,#101010)",

        border: featured
          ? "none"
          : "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 24,

        boxShadow: featured
          ? "0 20px 50px rgba(34,197,94,.30)"
          : "0 18px 45px rgba(0,0,0,.35)",

        transition: ".25s",
      }}
    >
      <div
        style={{
          fontSize: 30,
          marginBottom: 18,
        }}
      >
        🏪
      </div>

      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: ".6px",
          fontWeight: 700,
          color: featured
            ? "#fff"
            : "#888",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 40,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        ${value.toFixed(2)}
      </div>

      <div
        style={{
          marginTop: 14,
          color: featured
            ? "rgba(255,255,255,.85)"
            : "#8b8b8b",

          fontSize: 14,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}