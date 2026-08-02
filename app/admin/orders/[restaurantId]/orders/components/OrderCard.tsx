"use client";

import { motion } from "framer-motion";
import WolfButton from "@/components/ui/WolfButton";

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

      
       {/* ESTADO DEL PEDIDO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 10,
        }}
      >
        <WolfButton
          variant={
            order.status === "accepted"
              ? "info"
              : "secondary"
          }
          onClick={() =>
            onUpdateStatus(order.id, "accepted")
          }
        >
          ✅ Aceptar
        </WolfButton>

        <WolfButton
          variant={
            order.status === "preparing"
              ? "primary"
              : "secondary"
          }
          onClick={() =>
            onUpdateStatus(order.id, "preparing")
          }
        >
          👨‍🍳 Preparar
        </WolfButton>

        <WolfButton
          variant={
            order.status === "ready"
              ? "success"
              : "secondary"
          }
          onClick={() =>
            onUpdateStatus(order.id, "ready")
          }
        >
          📦 Listo
        </WolfButton>

        <WolfButton
          variant={
            order.status === "out_for_delivery"
              ? "info"
              : "secondary"
          }
          onClick={() =>
            onUpdateStatus(
              order.id,
              "out_for_delivery"
            )
          }
        >
          🚚 En camino
        </WolfButton>

        <WolfButton
          fullWidth
          variant="success"
          onClick={() =>
            onUpdateStatus(
              order.id,
              "completed"
            )
          }
        >
          ✔ Completar pedido
        </WolfButton>
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

        <WolfButton
          variant={
            order.payment_status === "paid"
              ? "success"
              : "primary"
          }
          onClick={() =>
            onUpdatePayment(
              order.id,
              "paid"
            )
          }
        >
          💳 Marcar pagado
        </WolfButton>
      </div>

      {/* ACTUALIZAR */}

      <WolfButton
        fullWidth
        variant="primary"
        onClick={() =>
          onViewDetail(order.id)
        }
      >
        🔎 Ver detalle
      </WolfButton>
    </article>
  );
}