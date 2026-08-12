"use client";

import type { CustomerOrderItem } from "../../types/customerOrder";

interface OrderItemsProps {
  items: CustomerOrderItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function OrderItems({ items }: OrderItemsProps) {
  if (!items.length) {
    return (
      <div className="py-4 text-center text-sm text-neutral-400">
        No hay productos registrados.
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {item.name}
            </p>

            <p className="mt-0.5 text-xs text-neutral-400">
              {item.quantity} × {formatCurrency(item.unit_price)}
            </p>
          </div>

          <p className="shrink-0 text-sm font-medium text-neutral-900">
            {formatCurrency(item.total_price)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default OrderItems;