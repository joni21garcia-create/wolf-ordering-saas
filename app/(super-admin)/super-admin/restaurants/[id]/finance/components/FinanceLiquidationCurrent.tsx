"use client";

interface Liquidation {
  id?: string;

  month?: number;

  year?: number;

  sales_total?: number;

  wolf_total?: number;

  restaurant_total?: number;

  total_orders?: number;

  status?: string;
}

interface Props {
  liquidation: Liquidation | null;

  sales: number;

  wolf: number;

  restaurant: number;

  orders: number;
}

export default function FinanceLiquidationCurrent({
  liquidation,
  sales,
  wolf,
  restaurant,
  orders,
}: Props) {
  const status =
    liquidation?.status ??
    "pending";

  const paid =
    status === "paid";

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
          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 18,

          marginBottom: 22,
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
            💳 Liquidación Actual
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b8b",
            }}
          >
            Información oficial de la
            liquidación vigente.
          </p>
        </div>

        <div
          style={{
            padding:
              "10px 18px",

            borderRadius: 999,

            background: paid
              ? "rgba(34,197,94,.12)"
              : "rgba(245,158,11,.12)",

            color: paid
              ? "#22c55e"
              : "#f59e0b",

            border: paid
              ? "1px solid rgba(34,197,94,.25)"
              : "1px solid rgba(245,158,11,.25)",

            fontWeight: 800,
          }}
        >
          {paid
            ? "Pagada"
            : "Pendiente"}
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(180deg,#171717,#101010)",

          border:
            "1px solid rgba(255,255,255,.07)",

          borderRadius: 26,

          padding: 28,
        }}
      >
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",

            gap: 20,
          }}
        >
          <Metric
            title="Periodo"
            value={
              liquidation
                ? `${liquidation.month}/${liquidation.year}`
                : "Sin liquidación"
            }
          />

          <Metric
            title="Ventas"
            value={`$${sales.toFixed(
              2
            )}`}
          />

          <Metric
            title="Wolf"
            value={`$${wolf.toFixed(
              2
            )}`}
            color="#f97316"
          />

          <Metric
            title="Restaurante"
            value={`$${restaurant.toFixed(
              2
            )}`}
            color="#22c55e"
          />

          <Metric
            title="Pedidos"
            value={orders}
          />

          <Metric
            title="Estado"
            value={
              paid
                ? "Pagado"
                : "Pendiente"
            }
            color={
              paid
                ? "#22c55e"
                : "#f59e0b"
            }
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.03)",

        border:
          "1px solid rgba(255,255,255,.05)",

        borderRadius: 18,

        padding: 18,
      }}
    >
      <div
        style={{
          color: "#888",

          fontSize: 12,

          fontWeight: 700,

          textTransform:
            "uppercase",

          letterSpacing: .8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,

          color:
            color ?? "#fff",

          fontSize: 30,

          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}