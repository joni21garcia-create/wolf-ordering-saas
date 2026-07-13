interface Props {
  order: any;
}

export default function DeliveryCard({ order }: Props) {
  if (order.order_type !== "delivery") {
    return null;
  }

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 28,
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Delivery
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Información de Entrega
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 18,
        }}
      >
        <Info
          title="Dirección"
          value={order.delivery_address}
        />

        <Info
          title="Sector"
          value={order.delivery_sector}
        />

        <Info
          title="Tiempo estimado"
          value={
            order.estimated_minutes
              ? `${order.estimated_minutes} min`
              : "-"
          }
        />

        <Info
          title="Estado"
          value={order.status}
        />
      </div>

      <div
        style={{
          marginTop: 22,
          background: "rgba(255,255,255,.025)",
          borderRadius: 18,
          padding: 18,
          border: "1px solid rgba(255,255,255,.05)",
        }}
      >
        <div
          style={{
            color: "#777",
            fontSize: 12,
            marginBottom: 10,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Instrucciones del Cliente
        </div>

        <div
          style={{
            color: "#fff",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
          }}
        >
          {order.delivery_instructions ||
            "Sin instrucciones adicionales."}
        </div>
      </div>
    </section>
  );
}

function Info({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.025)",
        borderRadius: 18,
        padding: 18,
        border: "1px solid rgba(255,255,255,.05)",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 12,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#fff",
          fontWeight: 600,
          fontSize: 17,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}