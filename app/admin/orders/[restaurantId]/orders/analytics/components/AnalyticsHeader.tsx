"use client";

import Link from "next/link";

interface Props {
  restaurantId: string;
  totalOrders: number;
  updatedAt?: string;
}

export default function AnalyticsHeader({
  restaurantId,
  totalOrders,
  updatedAt,
}: Props) {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 24,
        flexWrap: "wrap",
        marginBottom: 34,
      }}
    >
      <div>
        <Link
          href={`/admin/orders/${restaurantId}/orders`}
          style={{
            color: "#f97316",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          ← Volver al panel
        </Link>

        <div
          style={{
            marginTop: 26,
            color: "#777",
            fontSize: 13,
            letterSpacing: 3,
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          Revenue Intelligence
        </div>

        <h1
          style={{
            margin: "10px 0 12px",
            color: "#fff",
            fontWeight: 900,
            fontSize: "clamp(38px,5vw,60px)",
            lineHeight: 1.05,
          }}
        >
          Analytics
        </h1>

        <p
          style={{
            margin: 0,
            color: "#9ca3af",
            fontSize: 17,
            maxWidth: 760,
            lineHeight: 1.7,
          }}
        >
          Analiza ventas, pedidos, comisiones, métodos de pago,
          comportamiento del restaurante y métricas financieras en tiempo real.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <InfoCard
          title="Pedidos"
          value={totalOrders.toString()}
          color="#f97316"
        />

        <InfoCard
          title="Actualizado"
          value={
            updatedAt
              ? new Date(updatedAt).toLocaleString()
              : "Tiempo real"
          }
          color="#22c55e"
        />
      </div>
    </section>
  );
}

function InfoCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        minWidth: 190,
        padding: "18px 22px",
        borderRadius: 20,
        border: `1px solid ${color}30`,
        background:
          "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,
          color,
          fontSize: 20,
          fontWeight: 800,
          lineHeight: 1.4,
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}