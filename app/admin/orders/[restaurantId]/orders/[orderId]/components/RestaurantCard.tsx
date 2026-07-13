interface Props {
  order: any;
}

export default function RestaurantCard({ order }: Props) {
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
          Restaurante
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Información del Restaurante
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",
          gap: 18,
        }}
      >
        <Info
          title="Restaurante ID"
          value={order.restaurant_id}
        />

        <Info
          title="Tipo de Pedido"
          value={order.order_type}
        />

        <Info
          title="Estado"
          value={order.status}
        />

        <Info
          title="Tracking"
          value={order.tracking_code}
        />

        <Info
          title="Creado"
          value={
            order.created_at
              ? new Date(
                  order.created_at
                ).toLocaleString()
              : "-"
          }
        />

        <Info
          title="Actualizado"
          value={
            order.updated_at
              ? new Date(
                  order.updated_at
                ).toLocaleString()
              : "-"
          }
        />
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
        background:
          "rgba(255,255,255,.025)",
        borderRadius: 18,
        padding: 18,
        border:
          "1px solid rgba(255,255,255,.05)",
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
          fontSize: 16,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}