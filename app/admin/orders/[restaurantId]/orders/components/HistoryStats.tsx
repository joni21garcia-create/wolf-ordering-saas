"use client";

interface Props {
  orders: any[];
}

export default function HistoryStats({
  orders,
}: Props) {
  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.total ?? 0),
    0
  );

  const cancelled = orders.filter(
    (o) => o.status === "cancelled"
  ).length;

  const average =
    totalOrders === 0
      ? 0
      : totalSales / totalOrders;

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
        title="Pedidos"
        value={totalOrders}
        color="#f97316"
        subtitle="Resultados encontrados"
      />

      <Card
        title="Ventas"
        value={`$${totalSales.toFixed(2)}`}
        color="#22c55e"
        subtitle="Total vendido"
      />

      <Card
        title="Ticket promedio"
        value={`$${average.toFixed(2)}`}
        color="#3b82f6"
        subtitle="Promedio por pedido"
      />

      <Card
        title="Cancelados"
        value={cancelled}
        color="#ef4444"
        subtitle="Pedidos cancelados"
      />
    </section>
  );
}

function Card({
  title,
  value,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  color: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border:
          "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 26,
      }}
    >
      <div
        style={{
          color: "#888",
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
          fontSize: 42,
          fontWeight: 900,
          marginTop: 12,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#777",
          marginTop: 8,
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}