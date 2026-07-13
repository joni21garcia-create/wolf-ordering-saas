"use client";

interface Props {
  sales: number;
  wolf: number;
  restaurant: number;
  orders: number;
  averageTicket: number;
}

export default function FinanceAnalyticsSummary({
  sales,
  wolf,
  restaurant,
  orders,
  averageTicket,
}: Props) {
  const wolfPercent =
    sales > 0
      ? (wolf / sales) * 100
      : 0;

  const restaurantPercent =
    sales > 0
      ? (restaurant / sales) * 100
      : 0;

  return (
    <section
      style={{
        marginTop: 42,
        marginBottom: 42,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            📈 Executive Summary
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#888",
            }}
          >
            Resumen financiero generado desde el motor de Analytics.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background:
              "rgba(59,130,246,.12)",
            color: "#3b82f6",
            border:
              "1px solid rgba(59,130,246,.25)",
            fontWeight: 800,
          }}
        >
          Analytics Engine
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(260px,1fr))",
          gap: 18,
        }}
      >
        <Metric
          title="Ventas Totales"
          value={`$${sales.toFixed(2)}`}
          subtitle="Facturación del período"
          color="#2563eb"
        />

        <Metric
          title="Comisión Wolf"
          value={`${wolfPercent.toFixed(1)} %`}
          subtitle={`$${wolf.toFixed(2)}`}
          color="#f97316"
        />

        <Metric
          title="Restaurante"
          value={`${restaurantPercent.toFixed(1)} %`}
          subtitle={`$${restaurant.toFixed(2)}`}
          color="#22c55e"
        />

        <Metric
          title="Ticket Promedio"
          value={`$${averageTicket.toFixed(2)}`}
          subtitle={`${orders} pedidos`}
          color="#8b5cf6"
        />
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
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
      }}
    >
      <div
        style={{
          color,
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 14,
          color: "#fff",
          fontSize: 36,
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 12,
          color: "#888",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}