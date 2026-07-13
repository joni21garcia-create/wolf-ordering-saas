"use client";

interface Props {
  salesTotal: number;

  wolfTotal: number;

  restaurantTotal: number;

  totalOrders: number;

  avgTicket: number;

  deliveryOrders: number;

  pickupOrders: number;

  cancelledOrders: number;
}

export default function AnalyticsStats({
  salesTotal,
  wolfTotal,
  restaurantTotal,
  totalOrders,
  avgTicket,
  deliveryOrders,
  pickupOrders,
  cancelledOrders,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(240px,1fr))",

        gap: 20,

        marginBottom: 30,
      }}
    >
      <Card
        title="Ventas"
        value={money(salesTotal)}
        color="#22c55e"
      />

      <Card
        title="Pedidos"
        value={totalOrders}
        color="#f97316"
      />

      <Card
        title="Wolf"
        value={money(wolfTotal)}
        color="#ef4444"
      />

      <Card
        title="Restaurante"
        value={money(restaurantTotal)}
        color="#3b82f6"
      />

      <Card
        title="Ticket Promedio"
        value={money(avgTicket)}
        color="#a855f7"
      />

      <Card
        title="Delivery"
        value={deliveryOrders}
        color="#06b6d4"
      />

      <Card
        title="Pickup"
        value={pickupOrders}
        color="#14b8a6"
      />

      <Card
        title="Cancelados"
        value={cancelledOrders}
        color="#dc2626"
      />
    </section>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;

  value: string | number;

  color: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 26,

        display: "flex",

        flexDirection: "column",

        gap: 10,
      }}
    >
      <div
        style={{
          color: "#8b8b8b",

          fontSize: 13,

          fontWeight: 700,

          textTransform: "uppercase",

          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,

          fontSize: 36,

          fontWeight: 900,

          lineHeight: 1,
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