"use client";

import { useEffect, useState } from "react";

import type { CustomerOrder } from "../../types/customerOrder";
import { getCustomerOrders } from "../../services/customerOrders";

import OrderCard from "./OrderCard";
import OrderItems from "./OrderItems";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";

interface OrdersSheetProps {
  open: boolean;
  onClose: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(".", "");
}

export function OrdersSheet({
  open,
  onClose,
}: OrdersSheetProps) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<CustomerOrder | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedOrder(null);
      return;
    }

    let cancelled = false;

    async function loadOrders() {
      setLoading(true);

      try {
        const data = await getCustomerOrders();

        if (!cancelled) {
          setOrders(data);
        }
      } catch (error) {
        console.error(
          "[DISCOVER ORDERS] Error cargando pedidos:",
          error
        );

        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
      "
      role="dialog"
      aria-modal="true"
      aria-label="Mis pedidos"
    >
      {/* Overlay */}
      <button
        type="button"
        aria-label="Cerrar pedidos"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/30
          backdrop-blur-[2px]
        "
      />

      {/* Sheet */}
      <aside
        className="
          absolute
          right-0
          top-0
          flex
          h-full
          w-full
          max-w-md
          flex-col
          bg-white
          shadow-2xl
          animate-in
          slide-in-from-right
          duration-300
        "
      >
        {/* Header */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-neutral-100
            px-5
            py-4
          "
        >
          <div className="min-w-0">
            {selectedOrder ? (
              <button
                type="button"
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-neutral-500
                  transition
                  hover:text-neutral-900
                "
              >
                <span
                  className="text-lg leading-none"
                  aria-hidden="true"
                >
                  ←
                </span>

                <span>Mis pedidos</span>
              </button>
            ) : (
              <>
                <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
                  Mis pedidos
                </h2>

                <p className="mt-0.5 text-xs text-neutral-400">
                  Tu historial de pedidos
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              text-xl
              text-neutral-400
              transition
              hover:bg-neutral-100
              hover:text-neutral-900
            "
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {selectedOrder ? (
            <OrderDetail order={selectedOrder} />
          ) : loading ? (
            <OrdersLoading />
          ) : orders.length === 0 ? (
            <OrdersEmpty />
          ) : (
            <div className="space-y-3 p-4">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

interface OrderDetailProps {
  order: CustomerOrder;
}

function OrderDetail({
  order,
}: OrderDetailProps) {
  return (
    <div className="space-y-7 p-5">
      {/* Restaurante */}
      <section>
        <div className="flex items-center gap-3">
          {order.restaurant.logo_url ? (
            <img
              src={order.restaurant.logo_url}
              alt=""
              className="
                h-11
                w-11
                rounded-2xl
                border
                border-neutral-100
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-2xl
                bg-neutral-100
                text-sm
                font-semibold
                text-neutral-500
              "
            >
              {order.restaurant.name
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-neutral-950">
              {order.restaurant.name}
            </h3>

            <p className="mt-0.5 text-xs text-neutral-400">
              #{order.order_number}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">
            {formatDate(order.created_at)}
          </p>

          <OrderStatusBadge status={order.status} />
        </div>
      </section>

      {/* Timeline */}
      <section>
        <SectionTitle>
          Estado del pedido
        </SectionTitle>

        <div className="mt-4">
          <OrderTimeline
            events={order.timeline}
          />
        </div>
      </section>

      {/* Productos */}
      <section>
        <SectionTitle>
          Tu pedido
        </SectionTitle>

        <div className="mt-2">
          <OrderItems items={order.items} />
        </div>

        <div
          className="
            mt-2
            flex
            items-center
            justify-between
            border-t
            border-neutral-100
            pt-4
          "
        >
          <span className="text-sm font-medium text-neutral-500">
            Total
          </span>

          <span className="text-base font-semibold text-neutral-950">
            {formatCurrency(order.total)}
          </span>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-400">
      {children}
    </h3>
  );
}

function OrdersLoading() {
  return (
    <div className="space-y-3 p-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="
            animate-pulse
            rounded-2xl
            border
            border-neutral-100
            p-4
          "
        >
          <div className="h-4 w-36 rounded bg-neutral-100" />
          <div className="mt-3 h-3 w-24 rounded bg-neutral-100" />
          <div className="mt-5 h-6 w-28 rounded-full bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

function OrdersEmpty() {
  return (
    <div
      className="
        flex
        min-h-[60vh]
        flex-col
        items-center
        justify-center
        px-8
        text-center
      "
    >
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-neutral-100
          text-xl
        "
        aria-hidden="true"
      >
        ◷
      </div>

      <h3 className="mt-4 text-base font-semibold text-neutral-900">
        Aún no tienes pedidos
      </h3>

      <p className="mt-1.5 max-w-xs text-sm leading-6 text-neutral-400">
        Cuando realices un pedido, aparecerá aquí.
      </p>
    </div>
  );
}

export default OrdersSheet;