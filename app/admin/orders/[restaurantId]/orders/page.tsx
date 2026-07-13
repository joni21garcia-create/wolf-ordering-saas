import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import OrdersClient from "./OrdersClient";

import type {
  DashboardMetrics,
  Order,
  OrdersBoardType,
  Restaurant,
} from "./components/types";

interface Props {
  params: Promise<{
    restaurantId: string;
  }>;
}

export default async function OrdersPage({
  params,
}: Props) {
  const { restaurantId } = await params;

  const supabase =
    await createSupabaseServerClient();

  /*
  ==========================================================
  AUTH
  ==========================================================
  */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
  ==========================================================
  RESTAURANTE
  ==========================================================
  */

  const {
    data: restaurant,
    error: restaurantError,
  } = await supabase
    .from("restaurants")
    .select(`
      id,
      name,
      slug,
      logo_url
    `)
    .eq("id", restaurantId)
    .single();

  if (restaurantError || !restaurant) {
    throw new Error(
      restaurantError?.message ??
        "Restaurant not found"
    );
  }

  /*
  ==========================================================
  PEDIDOS
  ==========================================================
  */

const { data: deliverySettings } = await supabase
  .from("restaurant_delivery_settings")
  .select(`
    delivery_mode,
    delivery_fee,
    free_delivery_enabled,
    free_delivery_minimum
  `)
  .eq("restaurant_id", restaurantId)
  .maybeSingle();


  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        quantity,
        unit_price,
        subtotal,
        products(
          id,
          name,
          image_url
        )
      )
    `)
    .eq(
      "restaurant_id",
      restaurantId
    )
    .order("created_at", {
      ascending: false,
    });

  if (ordersError) {
    throw new Error(
      ordersError.message
    );
  }

  const safeOrders =
    (orders ??
      []) as unknown as Order[];

      console.log(
  JSON.stringify(
    safeOrders[0],
    null,
    2
  )
);

  /*
  ==========================================================
  BOARD
  ==========================================================
  */

  const board: OrdersBoardType = {
    pending: safeOrders.filter(
      (order) => order.status === "pending"
    ),

    accepted: safeOrders.filter(
      (order) => order.status === "accepted"
    ),

    preparing: safeOrders.filter(
      (order) => order.status === "preparing"
    ),

    ready: safeOrders.filter(
      (order) => order.status === "ready"
    ),

    delivery: safeOrders.filter(
      (order) =>
        order.status ===
        "out_for_delivery"
    ),

    completed: safeOrders.filter(
      (order) =>
        order.status === "completed"
    ),
  };

  /*
  ==========================================================
  METRICS
  ==========================================================
  */

  const metrics: DashboardMetrics = {
    pending: board.pending.length,

    preparing:
      board.accepted.length +
      board.preparing.length,

    ready:
      board.ready.length +
      board.delivery.length,

    sales: safeOrders.reduce(
      (total, order) =>
        total + Number(order.total ?? 0),
      0
    ),

    wolf: safeOrders.reduce(
      (total, order) =>
        total +
        Number(order.wolf_amount ?? 0),
      0
    ),

    restaurant:
      safeOrders.reduce(
        (total, order) =>
          total +
          Number(
            order.restaurant_amount ?? 0
          ),
        0
      ),
  };

  /*
  ==========================================================
  RENDER
  ==========================================================
  */

  return (
 <OrdersClient
  restaurantId={restaurantId}
  restaurant={restaurant as Restaurant}
  initialOrders={safeOrders}
  initialBoard={board}
  initialMetrics={metrics}
  deliverySettings={{
    delivery_mode:
      deliverySettings?.delivery_mode ?? "fixed",

    delivery_fee:
      Number(deliverySettings?.delivery_fee ?? 0),

    free_delivery_enabled:
      deliverySettings?.free_delivery_enabled ?? false,

    free_delivery_minimum:
      Number(deliverySettings?.free_delivery_minimum ?? 0),
  }}
/>
  );
}