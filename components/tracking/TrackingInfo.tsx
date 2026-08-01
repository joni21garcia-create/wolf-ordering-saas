/*
==========================================================

Wolf Ordering

Tracking Info

==========================================================
*/

import Link from "next/link";
import type { ReactNode } from "react";

interface TrackingInfoProps {
  order: any;
  restaurantSlug?: string;
  deliverySettings: any;
}

export default function TrackingInfo({
  order,
  restaurantSlug,
  deliverySettings,
}: TrackingInfoProps) {

  const estimatedTime =
    order.order_type === "pickup"
      ? `${deliverySettings?.preparation_time ?? 0} min`
      : `${
          deliverySettings?.preparation_time ?? 0
        } - ${
          Number(
            deliverySettings?.preparation_time ?? 0
          ) +
          Number(
            deliverySettings?.delivery_time ?? 0
          )
        } min`;

  return (
    <>
      {/* Código */}

      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "25px",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <p
          style={{
            color: "#888",
            marginBottom: "10px",
          }}
        >
          Código de seguimiento
        </p>

        <h1
          style={{
            color: "#fff",
            margin: 0,
            fontSize: "42px",
            letterSpacing: "3px",
          }}
        >
          {order.tracking_code}
        </h1>
      </div>

      {/* Tiempo */}

      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          padding: "25px",
          marginBottom: "25px",
          border:
            "1px solid rgba(255,255,255,.08)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "10px",
          }}
        >
          ⏱ Tiempo estimado
        </h3>

        <div
          style={{
            color: "#f97316",
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          {estimatedTime}
        </div>

        <p
          style={{
            color:
              "rgba(255,255,255,.65)",
            marginTop: "10px",
          }}
        >
          Tiempo aproximado de preparación
          y entrega.
        </p>
      </div>

      {/* Información */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <Card
          title="👤 Cliente"
          value={order.customer_name}
        />

        <Card
          title="💰 Total"
          value={`$${Number(
            order.total
          ).toFixed(2)}`}
        />

        <Card
          title="📦 Tipo"
          value={order.order_type}
        />

        <Card
          title="💳 Pago"
          value={order.payment_status}
        />
      </div>

      {/* Botón */}

      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <Link
          href={`/${restaurantSlug ?? ""}`}
        >
          <button
            style={{
              padding: "15px 30px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "#f97316",
              color: "#fff",
              fontWeight: "700",
            }}
          >
            ◀️ Volver al inicio
          </button>
        </Link>
      </div>
    </>
  );

}

interface CardProps {
  title: string;
  value: ReactNode;
}

function Card({
  title,
  value,
}: CardProps) {

  return (
    <div
      style={{
        background: "#111",
        color: "#fff",
        padding: "24px",
        borderRadius: "20px",
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
      <h3>{title}</h3>

      <p>{value}</p>
    </div>
  );

}