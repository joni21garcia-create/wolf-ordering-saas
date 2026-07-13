"use client";

interface Props {
  deliveryOrders: number;
  pickupOrders: number;
  dineInOrders?: number;
}

export default function OrderTypesCard({
  deliveryOrders,
  pickupOrders,
  dineInOrders = 0,
}: Props) {
  const total =
    deliveryOrders +
    pickupOrders +
    dineInOrders;

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

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
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        Operación
      </div>

      <h2
        style={{
          margin: "8px 0 26px",
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
        }}
      >
        Tipos de Pedido
      </h2>

      <TypeRow
        icon="🛵"
        label="Delivery"
        value={deliveryOrders}
        total={total}
        color="#22c55e"
      />

      <TypeRow
        icon="🥡"
        label="Pickup"
        value={pickupOrders}
        total={total}
        color="#3b82f6"
      />

      <TypeRow
        icon="🍽️"
        label="Mesa"
        value={dineInOrders}
        total={total}
        color="#f97316"
      />
    </section>
  );
}

function TypeRow({
  icon,
  label,
  value,
  total,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent =
    total === 0
      ? 0
      : (value / total) * 100;

  return (
    <div
      style={{
        marginBottom: 22,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {icon} {label}
        </span>

        <span
          style={{
            color: "#ddd",
            fontWeight: 700,
          }}
        >
          {value} ({percent.toFixed(0)}%)
        </span>
      </div>

      <div
        style={{
          height: 10,
          background:
            "rgba(255,255,255,.06)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: ".3s",
          }}
        />
      </div>
    </div>
  );
}