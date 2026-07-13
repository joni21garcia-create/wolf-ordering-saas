"use client";

import OrderCard from "./OrderCard";

import {
  cardStyle,
  colors,
} from "./styles";

import type {
  Order,
} from "./types";

interface Props {
  title: string;

  color: string;

  orders: Order[];

 deliverySettings: {
  delivery_mode: "fixed" | "manual";
  delivery_fee: number;
  free_delivery_enabled: boolean;
  free_delivery_minimum: number;
};

  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<void>;

  onUpdatePayment: (
    orderId: string,
    payment: string
  ) => Promise<void>;

  onRefresh: () => Promise<void>;

  onViewDetail: (
  orderId: string
) => void;

}

export default function ColumnBoard({
  title,
  color,
  orders,
  deliverySettings,
  onUpdateStatus,
  onUpdatePayment,
  onRefresh,
  onViewDetail,
}: Props) {

  return (
    <section
      style={{
        ...cardStyle,

        width: 380,

        minWidth: 380,

        maxHeight:
          "calc(100vh - 250px)",

        display: "flex",

        flexDirection: "column",

        overflow: "hidden",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          padding: 18,

          borderBottom:
            "1px solid rgba(255,255,255,.06)",

          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          background:
            "rgba(255,255,255,.02)",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 700,

              fontSize: 18,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 6,

              color:
                colors.textSecondary,

              fontSize: 13,
            }}
          >
            {orders.length} pedidos
          </div>
        </div>

        <div
          style={{
            width: 42,

            height: 42,

            borderRadius: 14,

            background:
              `${color}22`,

            color,

            display: "flex",

            justifyContent:
              "center",

            alignItems: "center",

            fontWeight: 800,
          }}
        >
          {orders.length}
        </div>
      </div>

      {/* LISTA */}

      <div
        style={{
          flex: 1,

          overflowY: "auto",

          padding: 18,

          display: "flex",

          flexDirection: "column",

          gap: 16,
        }}
      >
        {orders.length === 0 && (
          <div
            style={{
              textAlign: "center",

              padding: 60,

              color:
                colors.textSecondary,

              fontSize: 14,
            }}
          >
            No hay pedidos
          </div>
        )}

        {orders.map((order) => (
<OrderCard
  key={order.id}
  order={order}
  deliverySettings={deliverySettings}
  onRefresh={onRefresh}
  onViewDetail={onViewDetail}
  onUpdateStatus={onUpdateStatus}
  onUpdatePayment={onUpdatePayment}
/>
        ))}
      </div>
    </section>
  );
}