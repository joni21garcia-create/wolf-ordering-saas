"use client";

interface Props {
  salesToday: number;
  salesWeek: number;
  salesMonth: number;
  totalOrders: number;
  averageTicket: number;
}

export default function FinanceOverview({
  salesToday,
  salesWeek,
  salesMonth,
  totalOrders,
  averageTicket,
}: Props) {
  return (
    <section
      style={{
        marginTop: 36,
        marginBottom: 42,
      }}
    >
      {/* Header */}

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
            }}
          >
            📊 Dashboard Financiero
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b8b",
            }}
          >
            Resumen general de ventas y rendimiento.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(249,115,22,.10)",
            color: "#f97316",
            border: "1px solid rgba(249,115,22,.20)",
            fontWeight: 700,
          }}
        >
          Live Analytics
        </div>
      </div>

      {/* Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 18,
        }}
      >
        <MetricCard
          title="Ventas Hoy"
          value={`$${salesToday.toFixed(2)}`}
          icon="💰"
        />

        <MetricCard
          title="Ventas Semana"
          value={`$${salesWeek.toFixed(2)}`}
          icon="📅"
        />

        <MetricCard
          title="Ventas Mes"
          value={`$${salesMonth.toFixed(2)}`}
          icon="📈"
        />

        <MetricCard
          title="Pedidos"
          value={totalOrders}
          icon="📦"
        />

        <MetricCard
          title="Ticket Promedio"
          value={`$${averageTicket.toFixed(2)}`}
          icon="🧾"
        />
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#171717,#101010)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 24,

        transition: ".25s",

        boxShadow:
          "0 18px 45px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          fontSize: 28,
          marginBottom: 14,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#8a8a8a",
          textTransform: "uppercase",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: ".5px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 38,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}