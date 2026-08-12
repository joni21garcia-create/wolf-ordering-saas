"use client";

import type { CustomerOrderStatus } from "../../types/customerOrder";

interface OrderStatusBadgeProps {
  status: CustomerOrderStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  CustomerOrderStatus,
  {
    label: string;
    dot: string;
    text: string;
    background: string;
  }
> = {
  pending: {
    label: "Pedido recibido",
    dot: "bg-amber-500",
    text: "text-amber-600",
    background: "bg-amber-50",
  },

  confirmed: {
    label: "Confirmado",
    dot: "bg-orange-500",
    text: "text-orange-600",
    background: "bg-orange-50",
  },

  preparing: {
    label: "En preparación",
    dot: "bg-orange-500",
    text: "text-orange-600",
    background: "bg-orange-50",
  },

  ready: {
    label: "Listo",
    dot: "bg-orange-500",
    text: "text-orange-600",
    background: "bg-orange-50",
  },

  on_the_way: {
    label: "En camino",
    dot: "bg-blue-500",
    text: "text-blue-600",
    background: "bg-blue-50",
  },

  delivered: {
    label: "Entregado",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    background: "bg-emerald-50",
  },

  cancelled: {
    label: "Cancelado",
    dot: "bg-red-500",
    text: "text-red-600",
    background: "bg-red-50",
  },
};

export function OrderStatusBadge({
  status,
  compact = false,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        ${compact ? "px-2 py-1" : "px-2.5 py-1.5"}
        ${config.background}
      `}
    >
      <span
        className={`
          shrink-0
          rounded-full
          ${compact ? "h-1.5 w-1.5" : "h-1.5 w-1.5"}
          ${config.dot}
        `}
        aria-hidden="true"
      />

      <span
        className={`
          font-medium
          ${compact ? "text-[11px]" : "text-xs"}
          ${config.text}
        `}
      >
        {config.label}
      </span>
    </span>
  );
}

export default OrderStatusBadge;