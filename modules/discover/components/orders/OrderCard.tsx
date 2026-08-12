"use client";

import type { CustomerOrder } from "../../types/customerOrder";

interface OrderCardProps {
  order: CustomerOrder;
  onClick: (order: CustomerOrder) => void;
}

function formatOrderDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(".", "");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getStatusLabel(status: CustomerOrder["status"]) {
  switch (status) {
    case "confirmed":
      return "Confirmado";

    case "preparing":
      return "En preparación";

    case "ready":
      return "Listo";

    case "on_the_way":
      return "En camino";

    case "delivered":
      return "Entregado";

    case "cancelled":
      return "Cancelado";

    case "pending":
    default:
      return "Pedido recibido";
  }
}

function getStatusClasses(status: CustomerOrder["status"]) {
  switch (status) {
    case "delivered":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-600",
        background: "bg-emerald-50",
      };

    case "cancelled":
      return {
        dot: "bg-red-500",
        text: "text-red-600",
        background: "bg-red-50",
      };

    case "pending":
      return {
        dot: "bg-amber-500",
        text: "text-amber-600",
        background: "bg-amber-50",
      };

    default:
      return {
        dot: "bg-orange-500",
        text: "text-orange-600",
        background: "bg-orange-50",
      };
  }
}

export function OrderCard({
  order,
  onClick,
}: OrderCardProps) {
  const status = getStatusClasses(order.status);

  const itemCount = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <button
      type="button"
      onClick={() => onClick(order)}
      className="
        group
        w-full
        rounded-2xl
        border
        border-neutral-200
        bg-white
        p-4
        text-left
        shadow-[0_1px_2px_rgba(0,0,0,0.03)]
        transition
        duration-200
        hover:border-neutral-300
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]
        active:scale-[0.99]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-orange-500/30
      "
      aria-label={`Ver pedido ${order.order_number}`}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {order.restaurant.logo_url ? (
              <img
                src={order.restaurant.logo_url}
                alt=""
                className="
                  h-8
                  w-8
                  shrink-0
                  rounded-xl
                  border
                  border-neutral-100
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-neutral-100
                  text-xs
                  font-semibold
                  text-neutral-500
                "
                aria-hidden="true"
              >
                {order.restaurant.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-neutral-900">
                {order.restaurant.name}
              </p>

              <p className="mt-0.5 text-xs text-neutral-400">
                #{order.order_number}
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de navegación */}
        <span
          className="
            mt-1
            shrink-0
            text-lg
            leading-none
            text-neutral-300
            transition
            duration-200
            group-hover:translate-x-0.5
            group-hover:text-neutral-500
          "
          aria-hidden="true"
        >
          ›
        </span>
      </div>

      {/* Fecha */}
      <div className="mt-4">
        <p className="text-xs text-neutral-400">
          {formatOrderDate(order.created_at)}
        </p>
      </div>

      {/* Estado + resumen */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <div
          className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            px-2.5
            py-1.5
            ${status.background}
          `}
        >
          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${status.dot}
            `}
            aria-hidden="true"
          />

          <span
            className={`
              text-xs
              font-medium
              ${status.text}
            `}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="text-right">
          <p className="text-sm font-semibold text-neutral-900">
            {formatCurrency(order.total)}
          </p>

          <p className="mt-0.5 text-[11px] text-neutral-400">
            {itemCount}{" "}
            {itemCount === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>
    </button>
  );
}

export default OrderCard;