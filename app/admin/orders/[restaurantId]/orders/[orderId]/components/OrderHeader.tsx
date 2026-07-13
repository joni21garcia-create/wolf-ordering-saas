import Link from "next/link";

interface Props {
  restaurantId: string;
  order: any;
}

export default function OrderHeader({
  restaurantId,
  order,
}: Props) {
  const statusColors: Record<string, string> = {
    pending: "#f97316",
    accepted: "#3b82f6",
    preparing: "#f59e0b",
    ready: "#10b981",
    completed: "#22c55e",
    cancelled: "#ef4444",
  };

  const paymentColors: Record<string, string> = {
    paid: "#22c55e",
    pending: "#f59e0b",
    failed: "#ef4444",
    refunded: "#6366f1",
  };

  const statusColor =
    statusColors[order.status] ?? "#888";

  const paymentColor =
    paymentColors[order.payment_status] ?? "#888";

  const created = order.created_at
    ? new Date(order.created_at)
    : null;

  const date = created
    ? created.toLocaleDateString()
    : "-";

  const hour = created
    ? created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        marginBottom: 30,
      }}
    >
      <Link
        href={`/admin/orders/${restaurantId}/orders`}
        style={{
          color: "#f97316",
          textDecoration: "none",
          fontWeight: 700,
          width: "fit-content",
        }}
      >
        ← Volver al panel
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color: "#777",
              textTransform: "uppercase",
              fontSize: 12,
              letterSpacing: 2,
            }}
          >
            Detalle del Pedido
          </div>

          <h1
            style={{
              color: "#fff",
              margin: "10px 0",
              fontSize: "clamp(34px,5vw,56px)",
              fontWeight: 800,
            }}
          >
            #{order.tracking_code}
          </h1>

          <div
            style={{
              color: "#888",
              display: "flex",
              gap: 15,
              flexWrap: "wrap",
            }}
          >
            <span>{date}</span>
            <span>{hour}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Badge
            color={statusColor}
            text={(order.status ?? "").toUpperCase()}
          />

          <Badge
            color={paymentColor}
            text={
              order.payment_status === "paid"
                ? "PAGADO"
                : "PENDIENTE"
            }
          />

          <Badge
            color="#3b82f6"
            text={(order.order_type ?? "").toUpperCase()}
          />
        </div>
      </div>
    </header>
  );
}

function Badge({
  color,
  text,
}: {
  color: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "12px 18px",
        borderRadius: 999,
        border: `1px solid ${color}55`,
        background: `${color}15`,
        color,
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}