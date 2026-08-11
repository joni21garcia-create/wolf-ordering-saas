"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import OperationsHeader from "./components/OperationsHeader";
import FiltersBar from "./components/FiltersBar";
import OrdersBoard from "./components/OrdersBoard";
import AppShell from "./components/layout/AppShell";

import type {
  DashboardMetrics,
  Order,
  OrdersBoardType,
  Restaurant,
} from "./components/types";



  interface Props {
    restaurantId: string;

    restaurant: Restaurant;

    initialOrders: Order[];

    initialBoard: OrdersBoardType;

    initialMetrics: DashboardMetrics;

    deliverySettings: {
      delivery_mode: "fixed" | "manual";
      delivery_fee: number;
      free_delivery_enabled: boolean;
      free_delivery_minimum: number;
    };
  }

  export default function OrdersClient({
    restaurantId,
    restaurant,
    initialOrders,
    initialBoard,
    initialMetrics,
    deliverySettings,
  }: Props) {

  const router = useRouter();

    /*
    ==========================================================
    STATES
    ==========================================================
    */


    
  const [orders, setOrders] =
      useState<Order[]>(initialOrders);


  const [loading, setLoading] =
      useState(false);

  const [connected, setConnected] = useState(false);

    const [search, setSearch] =
      useState("");

    const [
      paymentFilter,
      setPaymentFilter,
    ] = useState("all");

    const [
      orderTypeFilter,
      setOrderTypeFilter,
    ] = useState("all");

    const [
      selectedMobileTab,
      setSelectedMobileTab,
    ] = useState<
      | "pending"
      | "preparing"
      | "ready"
      | "completed"
    >("pending");

    const [
      soundEnabled,
      setSoundEnabled,
    ] = useState(true);

    const [toastOpen, setToastOpen] =
      useState(false);

    const [toastTitle, setToastTitle] =
      useState("");

    const [
      toastMessage,
      setToastMessage,
    ] = useState("");

const [ringBell, setRingBell] =
  useState(false);


    /*
    ==========================================================
    REFS
    ==========================================================
    */

    const audioRef =
      useRef<HTMLAudioElement | null>(
        null
      );

    const channelRef =
      useRef<any>(null);

    /*
    ==========================================================
    REFRESH
    ==========================================================
    */

    const refreshPromiseRef =
      useRef<Promise<void> | null>(null);

    const refreshOrders = useCallback(async () => {
      // Evita dos refresh simultáneos cuando una acción y
      // Supabase Realtime ocurren prácticamente al mismo tiempo.
      if (refreshPromiseRef.current) {
        return refreshPromiseRef.current;
      }

      const promise = (async () => {
        try {
          setLoading(true);

          const response = await fetch(
            "/api/orders/get-orders",
            {
              cache: "no-store",
            }
          );

          const json = await response.json();

          if (!response.ok || !json.success) {
            console.error(
              "No fue posible actualizar los pedidos:",
              json?.error
            );
            return;
          }

          setOrders(
            Array.isArray(json.orders)
              ? json.orders
              : []
          );
        } catch (error) {
          console.error(
            "Error actualizando pedidos:",
            error
          );
        } finally {
          setLoading(false);
        }
      })();

      refreshPromiseRef.current = promise;

      try {
        await promise;
      } finally {
        if (
          refreshPromiseRef.current === promise
        ) {
          refreshPromiseRef.current = null;
        }
      }
    }, []);

    /*
    ==========================================================
    BOARD
    ==========================================================
    */

    const board = useMemo<OrdersBoardType>(() => {
      return {
        pending: orders.filter(
          (o) => o.status === "pending"
        ),

        accepted: orders.filter(
          (o) => o.status === "accepted"
        ),

        preparing: orders.filter(
          (o) => o.status === "preparing"
        ),

        ready: orders.filter(
          (o) => o.status === "ready"
        ),

        delivery: orders.filter(
          (o) =>
            o.status ===
            "out_for_delivery"
        ),

        completed: orders.filter(
          (o) =>
            o.status === "completed"
        ),
      };
    }, [orders]);

    /*
    ==========================================================
    METRICS
    ==========================================================
    */

    const metrics =
      useMemo<DashboardMetrics>(() => {
        return {
          pending: board.pending.length,

          preparing:
            board.accepted.length +
            board.preparing.length,

          ready:
            board.ready.length +
            board.delivery.length,

          sales: orders.reduce(
            (acc, order) =>
              acc +
              Number(order.total ?? 0),
            0
          ),

          wolf: orders.reduce(
            (acc, order) =>
              acc +
              Number(
                order.wolf_amount ?? 0
              ),
            0
          ),

          restaurant:
            orders.reduce(
              (acc, order) =>
                acc +
                Number(
                  order.restaurant_amount ??
                    0
                ),
              0
            ),
        };
      }, [orders, board]);

    /*
    ==========================================================
    FILTROS
    ==========================================================
    */

    const filteredBoard =
      useMemo(() => {
        const normalizedSearch =
          search.trim().toLowerCase();

        const apply = (
          list: Order[]
        ) =>
          list.filter((order) => {
            const customerName =
              String(
                order.customer_name ?? ""
              ).toLowerCase();

            const customerPhone =
              String(
                order.customer_phone ?? ""
              );

            const matchesSearch =
              normalizedSearch === "" ||
              customerName.includes(
                normalizedSearch
              ) ||
              customerPhone.includes(
                search.trim()
              );

            const matchesPayment =
              paymentFilter === "all"
                ? true
                : order.payment_status ===
                  paymentFilter;

            const matchesType =
              orderTypeFilter === "all"
                ? true
                : order.order_type ===
                  orderTypeFilter;

            return (
              matchesSearch &&
              matchesPayment &&
              matchesType
            );
          });

        return {
          pending: apply(board.pending),

          accepted: apply(
            board.accepted
          ),

          preparing: apply(
            board.preparing
          ),

          ready: apply(board.ready),

          delivery: apply(
            board.delivery
          ),

          completed: apply(
            board.completed
          ),
        };
      }, [
        board,
        paymentFilter,
        orderTypeFilter,
        search,
      ]);

    /*
    ==========================================================
    SONIDO
    ==========================================================
    */

    useEffect(() => {
      audioRef.current = new Audio(
        "/sounds/new-order.mp3"
      );

      const saved =
        localStorage.getItem(
          "wolf-orders-sound"
        );

      if (saved !== null) {
        setSoundEnabled(
          saved === "true"
        );
      }
    }, []);

    const soundEnabledRef =
      useRef(soundEnabled);

    useEffect(() => {
      soundEnabledRef.current =
        soundEnabled;
    }, [soundEnabled]);

    const toggleSound = () => {
      const next =
        !soundEnabled;

      setSoundEnabled(next);

      localStorage.setItem(
        "wolf-orders-sound",
        String(next)
      );
    };

    /*
    ==========================================================
    REALTIME
    ==========================================================
    */

    useEffect(() => {
      if (channelRef.current) {
        supabase.removeChannel(
          channelRef.current
        );
      }

      channelRef.current =
        supabase
          .channel(
            `orders-${restaurantId}`
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "orders",
              filter: `restaurant_id=eq.${restaurantId}`,
            },
            async (payload) => {
              await refreshOrders();

if (payload.eventType === "INSERT") {

  setRingBell(true);

  setTimeout(() => {
    setRingBell(false);
  }, 700);

  if (
    soundEnabledRef.current &&
    audioRef.current
  ) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }


                setToastTitle(
                  "Nuevo pedido"
                );

                setToastMessage(
                  "Ha llegado un nuevo pedido."
                );

                setToastOpen(true);

                setTimeout(() => {
                  setToastOpen(
                    false
                  );
                }, 4000);
              }
            }
          )
          .subscribe((status) => {
            const isSubscribed =
              status === "SUBSCRIBED";

            setConnected(isSubscribed);

            if (isSubscribed) {
              refreshOrders();
            }
          });

      return () => {
        if (
          channelRef.current
        ) {
          supabase.removeChannel(
            channelRef.current
          );
        }
      };
    }, [
      restaurantId,
      refreshOrders,
    ]);

    /*
    ==========================================================
    ACCIONES
    ==========================================================
    */

    const updateStatus =
      useCallback(
        async (
          orderId: string,
          status: string
        ) => {
          const response = await fetch(
            "/api/orders/update-status",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                orderId,
                status,
              }),
              cache: "no-store",
            }
          );

          let result: any = null;

          try {
            result = await response.json();
          } catch {
            // Keep the HTTP status as the source of truth.
          }

          if (!response.ok || result?.success === false) {
            throw new Error(
              result?.error ||
                "No fue posible actualizar el estado del pedido."
            );
          }

          // Actualización inmediata del tablero.
          // Supabase Realtime queda como reconciliación con la BD.
          setOrders((currentOrders) =>
            currentOrders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: status as Order["status"],
                  }
                : order
            )
          );
        },
        [refreshOrders]
      );

    const updatePayment =
      useCallback(
        async (
          orderId: string,
          paymentStatus: string
        ) => {
          const response = await fetch(
            "/api/orders/update-payment-status",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

                 body: JSON.stringify({
                  orderId,
                  status: paymentStatus,
                  }),
              cache: "no-store",
            }
          );

          let result: any = null;

          try {
            result = await response.json();
          } catch {
            // Keep the HTTP status as the source of truth if the
            // endpoint does not return JSON.
          }

          if (!response.ok || result?.success === false) {
            throw new Error(
              result?.error ||
                "No fue posible actualizar el estado de pago."
            );
          }

          // Actualización inmediata del pago.
          // No hacemos otro GET aquí: Realtime reconciliará
          // el objeto con el valor real de Supabase.
          setOrders((currentOrders) =>
            currentOrders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    payment_status:
                      paymentStatus as Order["payment_status"],
                  }
                : order
            )
          );
        },
        [refreshOrders]
      );

  const handleViewDetail = (orderId: string) => {
    router.push(
      `/admin/orders/${restaurantId}/orders/${orderId}`
    );
  };

  return (
  <AppShell>
<div
  style={{
    width: "100%",
    padding: 0,
    margin: 0,
  }}
>
<OperationsHeader
  restaurant={restaurant}
  refreshing={loading}
  connectionStatus={
    connected
      ? "online"
      : "offline"
  }
  notificationCount={board.pending.length}
  ringBell={ringBell}
  onRefresh={refreshOrders}
  onOpenNotifications={() => {
    setSelectedMobileTab("pending");
  }}
/>

      <FiltersBar
        search={search}
        paymentFilter={paymentFilter}
        orderTypeFilter={orderTypeFilter}
        loading={loading}
        onSearchChange={setSearch}
        onPaymentFilterChange={setPaymentFilter}
        onOrderTypeFilterChange={setOrderTypeFilter}
        onRefresh={refreshOrders}
      />

      <OrdersBoard
        board={filteredBoard}
        mobileTab={selectedMobileTab}
        deliverySettings={deliverySettings}
        onRefresh={refreshOrders}
        onViewDetail={handleViewDetail}
        onUpdateStatus={updateStatus}
        onUpdatePayment={updatePayment}
      />
    </div>
  </AppShell>
);
}