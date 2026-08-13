"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

import { WolfSheet } from "@/lib/wolf-ui";

import type { CustomerOrder } from "../../types/customerOrder";
import {
  buildTimeline,
  getCustomerOrders,
  normalizeOrderStatus,
} from "../../services/customerOrders";

import OrderCard from "./OrderCard";
import OrderItems from "./OrderItems";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";

const discoverRealtime = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

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

    async function refreshOrders() {
      try {
        const data = await getCustomerOrders();

        if (cancelled) return;

        setOrders(data);

        // Si estamos viendo un pedido, reemplazamos su detalle
        // por la versión más reciente reconstruida desde Supabase.
        setSelectedOrder((current) => {
          if (!current) return null;

          return (
            data.find(
              (order) => order.id === current.id
            ) ?? null
          );
        });
      } catch (error) {
        console.error(
          "[DISCOVER ORDERS] Error actualizando pedidos:",
          error
        );
      }
    }

    async function loadOrders() {
      setLoading(true);

      try {
        await refreshOrders();
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

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [open]);

  /*
   * =========================================================
   * REALTIME — SOLO EL PEDIDO ABIERTO
   * =========================================================
   *
   * No escuchamos toda la tabla `orders` desde Discover.
   * El cliente solo necesita recibir cambios del pedido
   * que está viendo en este momento.
   */
  useEffect(() => {
    if (!open || !selectedOrder?.id) {
      return;
    }

    let cancelled = false;

    const orderId = selectedOrder.id;

    console.log(
      "[DISCOVER ORDERS] Realtime conectando:",
      orderId
    );

    const channel = discoverRealtime
      .channel(`discover-order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (cancelled) return;

          console.log(
            "[DISCOVER ORDERS] Realtime UPDATE recibido:",
            payload.new
          );

          // Realtime ya entrega la fila actualizada. No esperamos
          // otro GET: actualizamos el pedido abierto inmediatamente.
          const next = payload.new as {
            id?: string;
            status?: string | null;
            created_at?: string | null;
            accepted_at?: string | null;
            preparing_at?: string | null;
            ready_at?: string | null;
            out_for_delivery_at?: string | null;
            completed_at?: string | null;
          };

          if (next.id !== orderId) return;

          setSelectedOrder((current) => {
            if (!current || current.id !== orderId) {
              return current;
            }

            const rawOrder = {
              status: next.status ?? current.status,
              created_at: next.created_at ?? current.created_at,
              accepted_at: next.accepted_at ?? null,
              preparing_at: next.preparing_at ?? null,
              ready_at: next.ready_at ?? null,
              out_for_delivery_at: next.out_for_delivery_at ?? null,
              completed_at: next.completed_at ?? null,
            };

            return {
              ...current,
              status: normalizeOrderStatus(rawOrder.status),
              timeline: buildTimeline(rawOrder),
            };
          });

          setOrders((currentOrders) =>
            currentOrders.map((order) => {
              if (order.id !== orderId) return order;

              const rawOrder = {
                status: next.status ?? order.status,
                created_at: next.created_at ?? order.created_at,
                accepted_at: next.accepted_at ?? null,
                preparing_at: next.preparing_at ?? null,
                ready_at: next.ready_at ?? null,
                out_for_delivery_at: next.out_for_delivery_at ?? null,
                completed_at: next.completed_at ?? null,
              };

              return {
                ...order,
                status: normalizeOrderStatus(rawOrder.status),
                timeline: buildTimeline(rawOrder),
              };
            })
          );
        }
      )
      .subscribe((status) => {
        if (cancelled) return;

        console.log(
          "[DISCOVER ORDERS] Realtime status:",
          status
        );
      });

    return () => {
      cancelled = true;

      console.log(
        "[DISCOVER ORDERS] Realtime desconectando:",
        orderId
      );

      void discoverRealtime.removeChannel(channel);
    };
  }, [open, selectedOrder?.id]);

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
      <WolfSheet
        open={open}
        onClose={onClose}
        title={
          selectedOrder
            ? "Mis pedidos"
            : "Mis pedidos"
        }
        ariaLabel="Mis pedidos"
        dismissible
        showCloseButton
        maxWidth={520}
      >
        {/* Volver desde el detalle */}
        {selectedOrder && (
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 18,
              zIndex: 2,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setSelectedOrder(null)
              }
              aria-label="Volver a mis pedidos"
              style={{
                height: 40,
                padding: "0 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 999,
                background: "rgba(255,255,255,.06)",
                color: "#A1A1AA",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                WebkitTapHighlightColor:
                  "transparent",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ←
              </span>
              <span>Mis pedidos</span>
            </button>
          </div>
        )}

        <div
          style={{
            minHeight: "100%",
            background: "#0D0D0F",
          }}
        >
          {selectedOrder ? (
            <OrderDetail
              order={selectedOrder}
            />
          ) : loading ? (
            <OrdersLoading />
          ) : orders.length === 0 ? (
            <OrdersEmpty />
          ) : (
            <div
              className="space-y-3 p-4"
              style={{
                paddingTop: 20,
              }}
            >
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
      </WolfSheet>
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
    <div
      className="space-y-7 p-5"
      style={{
        minHeight: "100%",
        background: "#FFFFFF",
      }}
    >
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