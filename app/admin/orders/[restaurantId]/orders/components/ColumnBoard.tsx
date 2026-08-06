"use client";

import { motion, AnimatePresence } from "framer-motion";

import OrderCard from "./OrderCard";

import {
  cardStyle,
  colors,
} from "./styles";

import type {
  Order,
} from "./types";

import {
  Clock3,
  ChefHat,
  PackageCheck,
  CircleCheckBig,
} from "lucide-react";

const columnIcons = {
  Pendientes: Clock3,
  Preparando: ChefHat,
  Listos: PackageCheck,
  Completados: CircleCheckBig,
} as const;

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

const Icon =
  columnIcons[
    title as keyof typeof columnIcons
  ] ?? Clock3;

  return (
<section
  style={{
    ...cardStyle,

    width: "100%",

    minWidth: 0,

    maxWidth: 380,

    maxHeight: "calc(100vh - 250px)",

    display: "flex",

    flexDirection: "column",

    overflow: "hidden",
  }}
>
{/* HEADER */}

<div
  style={{
    padding: 18,
    borderBottom: "1px solid rgba(255,255,255,.06)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    background: "#111111",
  }}
>
  {/* Izquierda */}
  <div>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontWeight: 700,
        fontSize: 18,
      }}
    >
      <Icon
        size={20}
        color={color}
        strokeWidth={2.2}
      />

      <span>{title}</span>
    </div>

    <div
      style={{
        marginTop: 6,
        fontSize: 12,
        color: "#a1a1aa",
        fontWeight: 600,
      }}
    >
      {title === "Pendientes" && "Esperando aceptación"}
      {title === "Aceptados" && "Esperando cocina"}
      {title === "Preparando" && "En preparación"}
      {title === "Listos" && "Listos para entregar"}
    </div>
  </div>

  {/* Contador */}
  <div
    style={{
      width: 42,
      height: 42,
      borderRadius: 14,
      background: `${color}22`,
      color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: 800,
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={orders.length}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.18 }}
      >
        {orders.length}
      </motion.span>
    </AnimatePresence>
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