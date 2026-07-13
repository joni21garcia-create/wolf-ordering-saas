"use client";

import {
  Clock3,
  MapPin,
  Phone,
  CreditCard,
  User,
} from "lucide-react";

import {
  cardStyle,
  colors,
} from "./styles";

import type {
  Order,
} from "./types";

import {
  getDeliveryDisplay,
} from "@/lib/delivery/getDeliveryDisplay";

interface Props {
  order: Order;

 deliverySettings: {
  delivery_mode: "fixed" | "manual";
  delivery_fee: number;
  free_delivery_enabled: boolean;
  free_delivery_minimum: number;
};

  onRefresh: () => Promise<void>;

  onViewDetail: (
  orderId: string
) => void;

  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<void>;

  onUpdatePayment: (
    orderId: string,
    payment: string
  ) => Promise<void>;
}

function money(value: number) {
  return `$ ${Number(value).toFixed(2)}`;
}

export default function OrderCard({
  order,
  deliverySettings,
  onRefresh,
  onViewDetail,
  onUpdateStatus,
  onUpdatePayment,
}: Props) {

  const delivery = getDeliveryDisplay({
    settings: deliverySettings,
    orderTotal: Number(order.subtotal ?? 0),
  });


  return (
    <article
      style={{
        ...cardStyle,

        padding: 18,

        display: "flex",

        flexDirection: "column",

        gap: 18,
      }}
    >
      {/* CABECERA */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,

              fontWeight: 700,
            }}
          >
            {order.customer_name}
          </div>

          <div
            style={{
              marginTop: 6,

              color:
                colors.textSecondary,

              fontSize: 13,
            }}
          >
            #{order.id.slice(0,8)}
          </div>
        </div>

        <div
          style={{
            background:
              "rgba(249,115,22,.12)",

            color:
              colors.orange,

            padding:
              "6px 12px",

            borderRadius:999,

            fontWeight:700,

            fontSize:12,
          }}
        >
          {order.status}
        </div>
      </div>

      {/* DATOS */}

      <div
        style={{
          display:"grid",

          gap:10,
        }}
      >
        <div
          style={{
            display:"flex",
            gap:10,
            alignItems:"center",
          }}
        >
          <User size={16}/>

          {order.customer_name}
        </div>

        {order.customer_phone && (

        <div
          style={{
            display:"flex",
            gap:10,
            alignItems:"center",
          }}
        >
          <Phone size={16}/>

          {order.customer_phone}
        </div>

        )}

        <div
          style={{
            display:"flex",
            gap:10,
            alignItems:"center",
          }}
        >
          <CreditCard size={16}/>

          {order.payment_method}
        </div>

        <div
          style={{
            display:"flex",
            gap:10,
            alignItems:"center",
          }}
        >
          <Clock3 size={16}/>

          {order.estimated_minutes ?? "--"} min
        </div>

        {order.order_type==="delivery" && (

        <div
          style={{
            display:"flex",
            gap:10,
            alignItems:"flex-start",
          }}
        >
          <MapPin size={16}/>

          <span>

            {order.delivery_address ?? "-"}

          </span>

        </div>

        )}

      </div>

      {/* PRODUCTOS */}

      <div>

        <div
          style={{
            fontWeight:700,

            marginBottom:12,
          }}
        >
          Productos
        </div>

        {(order.order_items ?? []).map(item=>(

          <div
            key={item.id}
            style={{
              display:"flex",

              justifyContent:"space-between",

              marginBottom:8,

              fontSize:14,
            }}
          >
            <span>

              {item.quantity} × {item.products?.name}

            </span>

            <strong>

              {money(item.subtotal)}

            </strong>

          </div>

        ))}

      </div>

      {/* TOTALES */}

      <div
        style={{
          borderTop:
            "1px solid rgba(255,255,255,.06)",

          paddingTop:16,

          display:"grid",

          gap:8,
        }}
      >
        <div
          style={{
            display:"flex",

            justifyContent:"space-between",
          }}
        >
          <span>Subtotal</span>

          <strong>

            {money(order.subtotal)}

          </strong>
        </div>

        <div
          style={{
            display:"flex",

            justifyContent:"space-between",
          }}
        >
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  }}
>
  <span>Delivery</span>

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 6,
    }}
  >
    {delivery.isManual && (
      <>
        <span
          style={{
            background: "rgba(249,115,22,.15)",
            color: "#f97316",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          🟠 Manual
        </span>

        <span
          style={{
            fontSize: 12,
            color: "#a1a1aa",
            textAlign: "right",
          }}
        >
          Costo acordado con el restaurante
        </span>
      </>
    )}

    {delivery.isFree && (
      <span
        style={{
          background: "rgba(34,197,94,.15)",
          color: "#22c55e",
          padding: "4px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        🟢 Delivery gratis
      </span>
    )}

    {!delivery.isManual && !delivery.isFree && (
      <strong
        style={{
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {delivery.label}
      </strong>
    )}
  </div>
</div>
        </div>

        <div
          style={{
            display:"flex",

            justifyContent:"space-between",

            fontSize:18,

            fontWeight:800,
          }}
        >
          <span>Total</span>

          <span>

            {money(order.total)}

          </span>

        </div>
      </div>

      {/*
           {/* ESTADO DEL PEDIDO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}
      >
        <button
          onClick={() =>
            onUpdateStatus(order.id, "accepted")
          }
          style={{
            padding: "12px",
            border: "none",
            borderRadius: 12,
            background:
              order.status === "accepted"
                ? "#2563eb"
                : "#1f2937",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Aceptar
        </button>

        <button
          onClick={() =>
            onUpdateStatus(order.id, "preparing")
          }
          style={{
            padding: "12px",
            border: "none",
            borderRadius: 12,
            background:
              order.status === "preparing"
                ? "#7c3aed"
                : "#1f2937",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Preparar
        </button>

        <button
          onClick={() =>
            onUpdateStatus(order.id, "ready")
          }
          style={{
            padding: "12px",
            border: "none",
            borderRadius: 12,
            background:
              order.status === "ready"
                ? "#16a34a"
                : "#1f2937",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Listo
        </button>

        <button
          onClick={() =>
            onUpdateStatus(
              order.id,
              "out_for_delivery"
            )
          }
          style={{
            padding: "12px",
            border: "none",
            borderRadius: 12,
            background:
              order.status ===
              "out_for_delivery"
                ? "#0891b2"
                : "#1f2937",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          En camino
        </button>

        <button
          onClick={() =>
            onUpdateStatus(order.id, "completed")
          }
          style={{
            gridColumn: "1 / -1",
            padding: "12px",
            border: "none",
            borderRadius: 12,
            background:
              order.status === "completed"
                ? "#22c55e"
                : "#15803d",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Completar pedido
        </button>
      </div>

      {/* PAGO */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 13,
              color: colors.textSecondary,
            }}
          >
            Estado del pago
          </div>

          <div
            style={{
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {order.payment_status}
          </div>
        </div>

        <button
          onClick={() =>
            onUpdatePayment(order.id, "paid")
          }
          style={{
            padding: "10px 18px",
            borderRadius: 12,
            border: "none",
            background:
              order.payment_status === "paid"
                ? "#16a34a"
                : colors.orange,
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Marcar pagado
        </button>
      </div>

      {/* ACTUALIZAR */}

<button
  onClick={() => onViewDetail(order.id)}
  style={{
    width: "100%",
    padding: "13px",
    borderRadius: 14,
    border: "none",
    background: "#d9711cc2",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  }}
>
  Ver detalle
</button>
    </article>
  );
}