"use client";

import { useState } from "react";

interface Props {
  order: any;
}

export default function OrderStatusCard({ order }: Props) {
  const [loading, setLoading] = useState(false);

  const STATUS_ORDER = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "completed",
];

const currentIndex = STATUS_ORDER.indexOf(
  order.status
);

function isCurrent(status: string) {
  return order.status === status;
}

function isDisabled(status: string) {
  if (order.status === "cancelled") return true;

  const index = STATUS_ORDER.indexOf(status);

  return (
    index !== -1 &&
    index < currentIndex
  );
}

  async function changeStatus(status: string) {
  try {
    setLoading(true);

    const response = await fetch(
      "/api/orders/update-status",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          status,
        }),
      }
    );


    const data = await response.json();

    if (!response.ok) {
      alert(data.error ?? "Error");
      return;
    }

    window.location.reload();

  } catch (error) {

    console.error(error);

    alert("No fue posible actualizar el pedido.");

  } finally {

    setLoading(false);

  }
}

  function StatusBadge() {
    let color = "#f59e0b";

    if (order.status === "accepted") color = "#3b82f6";

    if (order.status === "preparing") color = "#f97316";

    if (order.status === "ready") color = "#22c55e";

    if (order.status === "completed") color = "#16a34a";

    if (order.status === "cancelled") color = "#ef4444";

    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 18px",
          borderRadius: 999,
          background: `${color}20`,
          color,
          fontWeight: 700,
          fontSize: 14,
          border: `1px solid ${color}40`,
        }}
      >
        ● {order.status?.toUpperCase()}
      </div>
    );
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
          marginBottom: 28,
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
          Estado
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Gestión del Pedido
        </h2>
      </div>

      <StatusBadge />

      <div
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(170px,1fr))",
          gap: 14,
        }}
      >
<Button
  color="#2563eb"
  text={
    isCurrent("accepted")
      ? "✓ Aceptado"
      : "Aceptar"
  }
  disabled={
    loading ||
    isDisabled("accepted") ||
    isCurrent("accepted")
  }
  active={isCurrent("accepted")}
  onClick={() =>
    changeStatus("accepted")
  }
/>

<Button
  color="#ea580c"
  text={
    isCurrent("preparing")
      ? "✓ Preparando"
      : "Preparando"
  }
  disabled={
    loading ||
    isDisabled("preparing") ||
    isCurrent("preparing")
  }
  active={isCurrent("preparing")}
  onClick={() =>
    changeStatus("preparing")
  }
/>

<Button
  color="#16a34a"
  text={
    isCurrent("ready")
      ? "✓ Listo"
      : "Listo"
  }
  disabled={
    loading ||
    isDisabled("ready") ||
    isCurrent("ready")
  }
  active={isCurrent("ready")}
  onClick={() =>
    changeStatus("ready")
  }
/>

<Button
  color="#059669"
  text={
    isCurrent("completed")
      ? "✓ Entregado"
      : "Entregado"
  }
  disabled={
    loading ||
    isDisabled("completed") ||
    isCurrent("completed")
  }
  active={isCurrent("completed")}
  onClick={() =>
    changeStatus("completed")
  }
/>

<Button
  color="#dc2626"
  text={
    order.status === "cancelled"
      ? "✓ Cancelado"
      : "Cancelar"
  }
  disabled={
    loading ||
    order.status === "completed" ||
    order.status === "cancelled"
  }
  active={
    order.status === "cancelled"
  }
  onClick={() =>
    changeStatus("cancelled")
  }
/>
</div>
      <div
        style={{
          marginTop: 30,
          color: "#666",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Los cambios de estado se sincronizan automáticamente
        con el panel de pedidos y notifican al cliente cuando
        corresponde.            
      </div>
    </section>
  );
}

function Button({
  text,
  color,
  onClick,
  disabled,
  active,
}: {
  text: string;
  color: string;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "16px",
        borderRadius: 16,
        border: "none",
        background: color,
        color: "#fff",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 15,
        opacity: disabled ? 0.45 : 1,
        transform: active ? "scale(1.02)" : "none",
        boxShadow: active
        ? `0 0 0 2px ${color}, 0 12px 24px ${color}30`
         : "none",
         transition: ".25s",                
      }}
    >
      {text}
    </button>
  );
}