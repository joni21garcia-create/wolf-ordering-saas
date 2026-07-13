"use client";

interface Props {
  cashOrders: number;
  qrOrders: number;
  transferOrders?: number;
  cardOrders?: number;
}

export default function PaymentMethodsCard({
  cashOrders,
  qrOrders,
  transferOrders = 0,
  cardOrders = 0,
}: Props) {
  const total =
    cashOrders +
    qrOrders +
    transferOrders +
    cardOrders;

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
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Pagos
      </div>

      <h2
        style={{
          margin: "8px 0 26px",
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
        }}
      >
        Métodos de Pago
      </h2>

      <Method
        label="💵 Efectivo"
        value={cashOrders}
        total={total}
        color="#22c55e"
      />

      <Method
        label="📱 QR"
        value={qrOrders}
        total={total}
        color="#3b82f6"
      />

      <Method
        label="💳 Tarjeta"
        value={cardOrders}
        total={total}
        color="#a855f7"
      />

      <Method
        label="🏦 Transferencia"
        value={transferOrders}
        total={total}
        color="#f97316"
      />
    </section>
  );
}

function Method({
  label,
  value,
  total,
  color,
}: {
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
          marginBottom: 8,
          color: "#fff",
          fontWeight: 600,
        }}
      >
        <span>{label}</span>

        <span>
          {value} ({percent.toFixed(0)}%)
        </span>
      </div>

      <div
        style={{
          height: 10,
          borderRadius: 999,
          background:
            "rgba(255,255,255,.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: ".35s",
          }}
        />
      </div>
    </div>
  );
}