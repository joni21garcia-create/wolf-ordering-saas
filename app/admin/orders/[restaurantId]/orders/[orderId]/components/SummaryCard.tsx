import { getDeliveryDisplay } from "@/lib/delivery/getDeliveryDisplay";

interface Props {
  order: any;

  deliverySettings: {
    delivery_mode: "fixed" | "manual";
    delivery_fee: number;
    free_delivery_enabled: boolean;
    free_delivery_minimum: number;
  };
}

export default function SummaryCard({
  order,
  deliverySettings,
}: Props) {

  const subtotal = Number(order.subtotal ?? 0);

const delivery = getDeliveryDisplay({
  settings: deliverySettings,
  orderTotal: subtotal,
});


  const commission = Number(order.commission_amount ?? 0);
  const restaurant = Number(order.restaurant_amount ?? 0);
  const wolf = Number(order.wolf_amount ?? 0);
  const total = Number(order.total ?? 0);

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
      <div style={{ marginBottom: 26 }}>
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Finanzas
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Resumen Financiero
        </h2>
      </div>

      <Row
        title="Subtotal"
        value={money(subtotal)}
      />

{order.order_type === "delivery" ? (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "14px 0",
      alignItems: "flex-start",
    }}
  >
    <span
      style={{
        color: "#999",
      }}
    >
      Delivery
    </span>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      {delivery.isFree && (
        <span
          style={{
            background: "rgba(34,197,94,.15)",
            color: "#22c55e",
            padding: "5px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          🟢 Delivery gratis
        </span>
      )}

      {delivery.isManual && (
        <>
          <span
            style={{
              background: "rgba(249,115,22,.15)",
              color: "#f97316",
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🟠 Manual
          </span>

          <span
            style={{
              color: "#999",
              fontSize: 12,
              textAlign: "right",
              maxWidth: 220,
            }}
          >
            Costo acordado con el restaurante
          </span>
        </>
      )}

      {!delivery.isFree && !delivery.isManual && (
        <strong
          style={{
            color: "#fff",
            fontSize: 17,
          }}
        >
          {delivery.label}
        </strong>
      )}
    </div>
  </div>
) : (
  <Row
    title="Delivery"
    value="No aplica"
  />
)}

      <Row
        title="Comisión Wolf"
        value={money(commission)}
        color="#f59e0b"
      />

      <Row
        title="Wolf recibe"
        value={money(wolf)}
        color="#ef4444"
      />

      <Row
        title="Restaurante recibe"
        value={money(restaurant)}
        color="#22c55e"
      />

      <div
        style={{
          height: 1,
          background:
            "rgba(255,255,255,.08)",
          margin: "22px 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          Total
        </span>

        <span
          style={{
            color: "#22c55e",
            fontSize: 32,
            fontWeight: 800,
          }}
        >
          {money(total)}
        </span>
      </div>
    </section>
  );
}

function Row({
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
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
      }}
    >
      <span
        style={{
          color: "#999",
        }}
      >
        {title}
      </span>

      <strong
        style={{
          color: color ?? "#fff",
          fontSize: 17,
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}