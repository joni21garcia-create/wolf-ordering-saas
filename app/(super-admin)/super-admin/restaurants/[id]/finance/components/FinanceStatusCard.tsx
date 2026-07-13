"use client";

interface Props {
  currentStatus: string;
  currentPeriod: string;
  nextCutoff: string;
  nextPayment: string;
}

export default function FinanceStatusCard({
  currentStatus,
  currentPeriod,
  nextCutoff,
  nextPayment,
}: Props) {
  const paid =
    currentStatus === "paid";

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
            📅 Estado Financiero
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#888",
            }}
          >
            Estado operativo del ciclo financiero actual.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
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
            ? "Liquidación Pagada"
            : "Pendiente de Pago"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        <Card
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

        <Card
          title="Periodo"
          value={currentPeriod}
        />

        <Card
          title="Próximo Corte"
          value={nextCutoff}
        />

        <Card
          title="Próximo Pago"
          value={nextPayment}
        />
      </div>
    </section>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#171717,#101010)",
        border:
          "1px solid rgba(255,255,255,.07)",
        borderRadius: 22,
        padding: 22,
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
          marginTop: 12,
          color: color ?? "#fff",
          fontSize: 28,
          fontWeight: 900,
        }}
      >
        {value}
      </div>
    </div>
  );
}