"use client";

interface Props {
  pending: number;
  accepted: number;
  preparing: number;
  ready: number;
  delivery: number;
  completed: number;
  cancelled: number;
}

export default function StatusDistributionCard({
  pending,
  accepted,
  preparing,
  ready,
  delivery,
  completed,
  cancelled,
}: Props) {

  const total =
    pending +
    accepted +
    preparing +
    ready +
    delivery +
    completed +
    cancelled;

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
        Estados de los Pedidos
      </h2>

      <Row
        label="Pendientes"
        value={pending}
        total={total}
        color="#f59e0b"
      />

      <Row
        label="Aceptados"
        value={accepted}
        total={total}
        color="#2563eb"
      />

      <Row
        label="Preparando"
        value={preparing}
        total={total}
        color="#ea580c"
      />

      <Row
        label="Listos"
        value={ready}
        total={total}
        color="#16a34a"
      />

      <Row
        label="En camino"
        value={delivery}
        total={total}
        color="#0891b2"
      />

      <Row
        label="Completados"
        value={completed}
        total={total}
        color="#22c55e"
      />

      <Row
        label="Cancelados"
        value={cancelled}
        total={total}
        color="#dc2626"
      />
    </section>
  );
}

function Row({
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
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {label}
        </span>

        <span
          style={{
            color: "#bbb",
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