interface Props {
  order: any;
}

export default function TimelineCard({ order }: Props) {
  const isDelivery =
    String(order.order_type ?? "").trim().toLowerCase() ===
    "delivery";

  const currentStatus =
    String(order.status ?? "pending").trim().toLowerCase();

  const steps = [
    {
      key: "pending",
      title: "Pedido recibido",
      date: order.created_at,
      color: "#3b82f6",
    },
    {
      key: "accepted",
      title: "Pedido aceptado",
      date: order.accepted_at,
      color: "#f97316",
    },
    {
      key: "preparing",
      title: "En preparación",
      date: order.preparing_at,
      color: "#facc15",
    },
    {
      key: "ready",
      title: "Pedido listo",
      date: order.ready_at,
      color: "#10b981",
    },
    ...(isDelivery
      ? [{
          key: "out_for_delivery",
          title: "En camino",
          date: order.out_for_delivery_at,
          color: "#06b6d4",
        }]
      : []),
    {
      key: "completed",
      title: "Pedido entregado",
      date: order.completed_at,
      color: "#22c55e",
    },
  ];

  const currentIndex =
    currentStatus === "completed"
      ? steps.length - 1
      : Math.max(
          0,
          steps.findIndex(
            (step) => step.key === currentStatus
          )
        );

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
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Seguimiento
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Historial del Pedido
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {steps.map((step, index) => (
          <TimelineItem
            key={step.key}
            title={step.title}
            color={step.color}
            date={step.date}
            completed={Boolean(step.date) || index < currentIndex}
            current={
              index === currentIndex &&
              currentStatus !== "completed"
            }
            last={index === steps.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function TimelineItem({
  title,
  color,
  date,
  completed,
  current,
  last,
}: {
  title: string;
  color: string;
  date: string | null | undefined;
  completed: boolean;
  current: boolean;
  last: boolean;
}) {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: current
              ? color
              : completed
                ? color
                : "#333",
            border: `3px solid ${
              current || completed ? color : "#555"
            }`,
            boxShadow: current
              ? `0 0 0 6px ${color}22`
              : "none",
            zIndex: 2,
          }}
        />

        {!last && (
          <div
            style={{
              width: 2,
              height: 60,
              background: completed
                ? color
                : "#333",
              marginTop: 4,
            }}
          />
        )}
      </div>

      <div
        style={{
          flex: 1,
        }}
      >
        <div
          style={{
            color: current || completed
              ? "#fff"
              : "#666",
            fontWeight: 700,
            fontSize: 17,
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: "#888",
            marginTop: 6,
            fontSize: 14,
          }}
        >
          {date
            ? new Date(date).toLocaleString()
            : current
              ? "Actual"
              : "Pendiente"}
        </div>
      </div>
    </div>
  );
}