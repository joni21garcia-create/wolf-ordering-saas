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

  /*
  ==========================================================
  TIEMPO ESTIMADO
  ==========================================================
  */

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

  /*
  ==========================================================
  TRADUCCIONES
  ==========================================================
  */

  const orderType =
    order.order_type === "delivery"
      ? "🚚 Delivery"
      : order.order_type === "pickup"
      ? "🥡 Recoger en tienda"
      : order.order_type === "table"
      ? "🍽️ Mesa"
      : order.order_type;

  const paymentStatus =
    order.payment_status === "paid"
      ? "✅ Pagado"
      : order.payment_status === "pending"
      ? "⏳ Pendiente"
      : order.payment_status === "refunded"
      ? "💸 Reembolsado"
      : order.payment_status;

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
    <>
      <style>{`

        @media (max-width:768px){

          .tracking-code{
            padding:20px !important;
            border-radius:18px !important;
          }

          .tracking-code h1{
            font-size:30px !important;
            letter-spacing:1px !important;
            overflow-wrap:anywhere;
          }

          .tracking-time{
            padding:20px !important;
            border-radius:18px !important;
          }

          .tracking-time h3{
            font-size:20px !important;
          }

          .tracking-time-value{
            font-size:26px !important;
          }

          .tracking-grid{
            grid-template-columns:1fr !important;
            gap:14px !important;
          }

          .tracking-card{
            padding:18px !important;
          }

          .tracking-button{
            width:100%;
            padding:16px !important;
          }

        }

        .tracking-button{
  transition:.25s;
}

.tracking-button:hover{
  transform:translateY(-2px);
  box-shadow:0 18px 32px rgba(249,115,22,.38);
}

.tracking-card{
  transition:.25s;
}

.tracking-card:hover{
  transform:translateY(-3px);
  box-shadow:0 18px 34px rgba(0,0,0,.38);
}

      `}</style>

      {/*======================================================
      CÓDIGO DE SEGUIMIENTO
      ======================================================*/}

      <div
        className="tracking-code"
        style={{
          background:
            "linear-gradient(180deg,#151515,#101010)",

          borderRadius: 24,

          padding: 30,

          textAlign: "center",

          marginBottom: 24,

          border:
            "1px solid rgba(255,255,255,.06)",

          boxShadow:
            "0 15px 40px rgba(0,0,0,.35)",
        }}
      >
        <p
          style={{
            color: "#8f8f8f",
            marginBottom: 12,
            fontSize: 15,
          }}
        >
          Código de seguimiento
        </p>

        <h1
          style={{
            margin: 0,

            color: "#fff",

            fontSize: 42,

            fontWeight: 800,

            letterSpacing: 3,

            fontFamily:
              "JetBrains Mono, Consolas, monospace",

            textShadow:
              "0 0 20px rgba(249,115,22,.15)",
          }}
        >
          {order.tracking_code}
        </h1>
      </div>

      {/*======================================================
      TIEMPO ESTIMADO
      ======================================================*/}

      <div
        className="tracking-time"
        style={{
          background:
            "linear-gradient(180deg,#151515,#101010)",

          borderRadius: 24,

          padding: 26,

          marginBottom: 24,

          textAlign: "center",

          border:
            "1px solid rgba(255,255,255,.06)",

          boxShadow:
            "0 15px 40px rgba(0,0,0,.30)",
        }}
      >
        <h3
          style={{
            marginTop: 0,

            marginBottom: 12,

            color: "#fff",

            fontSize: 22,
          }}
        >
          ⏱ Tiempo estimado
        </h3>

        <div
          className="tracking-time-value"
          style={{
            color: "#fb923c",

            fontSize: 34,

            fontWeight: 800,
          }}
        >
          {estimatedTime}
        </div>

        <p
          style={{
            marginTop: 12,

            color:
              "rgba(255,255,255,.65)",

            lineHeight: 1.6,
          }}
        >
          Tiempo aproximado de preparación y entrega.
        </p>
      </div>

{/*======================================================
INFORMACIÓN DEL PEDIDO
======================================================*/}

<div
  className="tracking-card"
  style={{
    background:
      "linear-gradient(180deg,#161616,#101010)",

    borderRadius: 24,

    border:
      "1px solid rgba(255,255,255,.06)",

    boxShadow:
      "0 15px 40px rgba(0,0,0,.30)",

    overflow: "hidden",

    marginTop: 4,
  }}
>

  <Section
    label="👤 Cliente"
    value={order.customer_name}
  />

  <Section
    label="💰 Total"
    value={`$${Number(order.total).toFixed(2)}`}
  />

  <Section
    label="📦 Tipo de pedido"
    value={orderType}
  />

  <Section
    label="💳 Estado del pago"
    value={paymentStatus}
    last
  />

</div>


      {/*======================================================
      BOTÓN
      ======================================================*/}

      <div
        style={{
          display: "flex",
          justifyContent: "center",

          marginTop: 40,
        }}
      >
        <Link
          href={`/${restaurantSlug ?? ""}`}
          style={{
            width: "100%",
            maxWidth: 320,
            textDecoration: "none",
          }}
        >
          <button
            className="tracking-button"
            style={{
              width: "100%",

              padding: "16px 28px",

              borderRadius: 16,

              border: "none",

              cursor: "pointer",

              background:
                "linear-gradient(180deg,#fb923c,#ea580c)",

              color: "#fff",

              fontWeight: 700,

              fontSize: 15,

              letterSpacing: ".2px",

              transition: ".25s",

              boxShadow:
                "0 12px 24px rgba(249,115,22,.30)",

              outline: "none",
            }}

          >
            🏠 Volver al restaurante
          </button>
        </Link>
      </div>

    </>
  );
}
interface SectionProps {

  label: string;

  value: ReactNode;

  last?: boolean;

}

function Section({

  label,

  value,

  last = false,

}: SectionProps) {

  return (

    <div

      style={{

        padding: "20px 24px",

        borderBottom:
          last
            ? "none"
            : "1px solid rgba(255,255,255,.06)",

      }}

    >

      <div
        style={{
          color: "#9ca3af",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: ".5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.4,
        }}
      >
        {value}
      </div>

    </div>

  );

}