interface Props {
  order: any;
}

export default function CustomerCard({ order }: Props) {
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
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              color: "#f97316",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Cliente
          </div>

          <h2
            style={{
              margin: "6px 0 0",
              color: "#fff",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Información del Cliente
          </h2>
        </div>

        <div
          style={{
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(249,115,22,.10)",
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          {order.order_type?.toUpperCase()}
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 18,
        }}
      >
        <InfoItem
          title="Nombre"
          value={order.customer_name || "No registrado"}
        />

        <InfoItem
          title="Teléfono"
          value={order.customer_phone || "No registrado"}
        />

        <InfoItem
          title="Correo"
          value={order.customer_email || "No registrado"}
        />

        <InfoItem
          title="Tracking"
          value={order.tracking_code}
        />

        <InfoItem
          title="Estado"
          value={order.status}
        />

        <InfoItem
          title="Método de Pago"
          value={order.payment_method}
        />
      </div>
    </section>
  );
}

function InfoItem({
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
          fontSize: 17,
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}