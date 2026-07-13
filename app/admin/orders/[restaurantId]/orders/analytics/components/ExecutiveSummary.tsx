"use client";

interface Props {
  salesTotal: number;
  wolfTotal: number;
  restaurantTotal: number;
  avgTicket: number;
  totalOrders: number;
  deliveryOrders: number;
  pickupOrders: number;
}

export default function ExecutiveSummary({
  salesTotal,
  wolfTotal,
  restaurantTotal,
  avgTicket,
  totalOrders,
  deliveryOrders,
  pickupOrders,
}: Props) {

  const deliveryPercent =
    totalOrders === 0
      ? 0
      : (deliveryOrders / totalOrders) * 100;

  const pickupPercent =
    totalOrders === 0
      ? 0
      : (pickupOrders / totalOrders) * 100;

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 28,
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Ejecutivo
      </div>

      <h2
        style={{
          margin: "8px 0 28px",
          color: "#fff",
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        Resumen Financiero
      </h2>

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(240px,1fr))",

          gap: 18,
        }}
      >
        <Metric
          label="Ventas"
          value={money(salesTotal)}
        />

        <Metric
          label="Wolf"
          value={money(wolfTotal)}
        />

        <Metric
          label="Restaurante"
          value={money(restaurantTotal)}
        />

        <Metric
          label="Ticket promedio"
          value={money(avgTicket)}
        />

        <Metric
          label="Pedidos"
          value={String(totalOrders)}
        />

        <Metric
          label="% Delivery"
          value={`${deliveryPercent.toFixed(1)}%`}
        />

        <Metric
          label="% Pickup"
          value={`${pickupPercent.toFixed(1)}%`}
        />

        <Metric
          label="Ganancia promedio"
          value={
            totalOrders === 0
              ? "$0.00"
              : money(
                  restaurantTotal /
                    totalOrders
                )
          }
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.035)",

        border:
          "1px solid rgba(255,255,255,.06)",

        borderRadius: 18,

        padding: 20,
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 13,
          marginBottom: 10,
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function money(value: number) {
  return `$${Number(value).toFixed(2)}`;
}