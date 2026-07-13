interface Props {
  order: any;
}

export default function TechnicalCard({ order }: Props) {
  const rows = [
    {
      label: "ID del Pedido",
      value: order.id,
    },
    {
      label: "Tracking",
      value: order.tracking_code,
    },
    {
      label: "Restaurant ID",
      value: order.restaurant_id,
    },
    {
      label: "Cliente ID",
      value: order.customer_id,
    },
    {
      label: "QR ID",
      value: order.selected_qr_id,
    },
    {
      label: "QR",
      value: order.selected_qr_name,
    },
    {
      label: "Estado",
      value: order.status,
    },
    {
      label: "Estado Pago",
      value: order.payment_status,
    },
    {
      label: "Método Pago",
      value: order.payment_method,
    },
    {
      label: "Creado",
      value: format(order.created_at),
    },
    {
      label: "Aceptado",
      value: format(order.accepted_at),
    },
    {
      label: "Preparando",
      value: format(order.preparing_at),
    },
    {
      label: "Listo",
      value: format(order.ready_at),
    },
    {
      label: "Entregado",
      value: format(order.completed_at),
    },
    {
      label: "Actualizado",
      value: format(order.updated_at),
    },
  ];

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
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Auditoría
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Información Técnica
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
        }}
      >
        {rows.map((row) => (
          <Row
            key={row.label}
            title={row.label}
            value={row.value}
          />
        ))}
      </div>
    </section>
  );
}

function Row({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 20,
        flexWrap: "wrap",
        padding: "14px 0",
        borderBottom:
          "1px solid rgba(255,255,255,.05)",
      }}
    >
      <span
        style={{
          color: "#777",
          fontSize: 14,
        }}
      >
        {title}
      </span>

      <span
        style={{
          color: "#fff",
          fontWeight: 600,
          textAlign: "right",
          wordBreak: "break-all",
        }}
      >
        {value || "-"}
      </span>
    </div>
  );
}

function format(date: any) {
  if (!date) return "-";

  return new Date(date).toLocaleString();
}