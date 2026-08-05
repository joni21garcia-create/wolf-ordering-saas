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

    const refreshOrders = useCallback(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/orders/get-orders",
          {
            cache: "no-store",
          }
        );

        const json = await response.json();

        if (!json.success) {
          return;
        }

        setOrders(json.orders ?? []);


      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
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
        const apply = (
          list: Order[]
        ) =>
          list.filter((order) => {
            const matchesSearch =
              search === "" ||
              order.customer_name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              order.customer_phone
                ?.includes(search);

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

  if (soundEnabled && audioRef.current) {
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
            setConnected(
              status ===
                "SUBSCRIBED"
            );
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
      soundEnabled,
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
          await fetch(
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
            }
          );

          await refreshOrders();
        },
        [refreshOrders]
      );

    const updatePayment =
      useCallback(
        async (
          orderId: string,
          paymentStatus: string
        ) => {
          await fetch(
            "/api/orders/update-payment-status",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                orderId,
                paymentStatus,
              }),
            }
          );

          await refreshOrders();
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