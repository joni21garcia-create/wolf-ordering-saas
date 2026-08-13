import { supabase } from "@/lib/supabase/client";
import { getOrCreateWolfCustomerId } from "@/lib/supabase/client";
import {
  getCommissionConfig,
  getFinalPrice,
} from "@/lib/configuration/pricing";

import type {
  CustomerOrder,
  CustomerOrderItem,
  CustomerOrderStatus,
  CustomerOrderTimelineEvent,
} from "../types/customerOrder";

/**
 * Convierte los estados reales de orders a los estados
 * que consume la interfaz de Discover.
 */
export function normalizeOrderStatus(
  status: string | null
): CustomerOrderStatus {
  switch (status) {
    case "accepted":
         case "confirmed":
          return "confirmed";

    case "preparing":
      return "preparing";

    case "ready":
      return "ready";

    case "out_for_delivery":
      return "on_the_way";

    case "completed":
    case "delivered":
      return "delivered";

    case "cancelled":
    case "canceled":
      return "cancelled";

    case "pending":
    default:
      return "pending";
  }
}

/**
 * Construye la línea de tiempo usando las fechas reales
 * almacenadas en orders.
 */
export function buildTimeline(order: {
  status: string | null;
  created_at: string | null;
  accepted_at: string | null;
  preparing_at: string | null;
  ready_at: string | null;
  out_for_delivery_at: string | null;
  completed_at: string | null;
}): CustomerOrderTimelineEvent[] {
  const currentStatus = normalizeOrderStatus(order.status);

  const events: Array<{
    status: CustomerOrderStatus;
    label: string;
    timestamp: string | null;
  }> = [
    {
      status: "pending",
      label: "Pedido recibido",
      timestamp: order.created_at,
    },
    {
      status: "confirmed",
      label: "Pedido confirmado",
      timestamp: order.accepted_at,
    },
    {
      status: "preparing",
      label: "En preparación",
      timestamp: order.preparing_at,
    },
    {
      status: "ready",
      label: "Listo",
      timestamp: order.ready_at,
    },
    {
      status: "on_the_way",
      label: "En camino",
      timestamp: order.out_for_delivery_at,
    },
    {
      status: "delivered",
      label: "Entregado",
      timestamp: order.completed_at,
    },
  ];

  const statusOrder: CustomerOrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "on_the_way",
    "delivered",
  ];

  const currentIndex = statusOrder.indexOf(currentStatus);

  return events.map((event) => {
    const eventIndex = statusOrder.indexOf(event.status);

    return {
      ...event,
      completed:
        currentStatus !== "cancelled" &&
        eventIndex >= 0 &&
        eventIndex < currentIndex,
      current:
        currentStatus !== "cancelled" &&
        event.status === currentStatus,
    };
  });
}

/**
 * Obtiene el historial global de pedidos del cliente Wolf.
 *
 * La pertenencia del pedido al cliente se determina mediante
 * discover_order_history. Los datos completos siguen viviendo
 * en orders, order_items, products y restaurants.
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const customerId = getOrCreateWolfCustomerId();

  if (!customerId) {
    return [];
  }

  const { data: history, error: historyError } = await supabase
    .from("discover_order_history")
    .select("order_id, restaurant_id, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  if (historyError) {
    console.error(
      "[DISCOVER ORDERS] Error obteniendo historial:",
      historyError
    );
    return [];
  }

  if (!history?.length) {
    return [];
  }

  const orderIds = [
    ...new Set(history.map((entry) => entry.order_id)),
  ];

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        id,
        restaurant_id,
        status,
        total,
        created_at,
        accepted_at,
        preparing_at,
        ready_at,
        out_for_delivery_at,
        completed_at,
        tracking_code
      `
    )
    .in("id", orderIds);

  if (ordersError) {
    console.error(
      "[DISCOVER ORDERS] Error obteniendo pedidos:",
      ordersError
    );
    return [];
  }

  if (!orders?.length) {
    return [];
  }

  const restaurantIds = [
    ...new Set(
      orders
        .map((order) => order.restaurant_id)
        .filter(Boolean)
    ),
  ];

  const { data: restaurants, error: restaurantsError } =
    await supabase
      .from("restaurants")
      .select(`
        id,
        name,
        logo_url,
        commission_active,
        commission_type,
        commission_percentage
      `)
      .in("id", restaurantIds);

  if (restaurantsError) {
    console.error(
      "[DISCOVER ORDERS] Error obteniendo restaurantes:",
      restaurantsError
    );
    return [];
  }

  const { data: orderItems, error: orderItemsError } =
    await supabase
      .from("order_items")
      .select(
        `
          order_id,
          product_id,
          quantity,
          unit_price,
          subtotal
        `
      )
      .in("order_id", orderIds);

  if (orderItemsError) {
    console.error(
      "[DISCOVER ORDERS] Error obteniendo productos del pedido:",
      orderItemsError
    );
    return [];
  }

  const productIds = [
    ...new Set(
      (orderItems ?? [])
        .map((item) => item.product_id)
        .filter(Boolean)
    ),
  ];

  const { data: products, error: productsError } =
    productIds.length
      ? await supabase
          .from("products")
          .select("id, name")
          .in("id", productIds)
      : { data: [], error: null };

  if (productsError) {
    console.error(
      "[DISCOVER ORDERS] Error obteniendo nombres de productos:",
      productsError
    );
    return [];
  }

  const result: CustomerOrder[] = orders
    .map((order) => {
      const restaurant = restaurants?.find(
        (item) => item.id === order.restaurant_id
      );

      /*
       * ==========================================================
       * PRICING OFICIAL DE WOLF
       * ==========================================================
       *
       * El unit_price almacenado en order_items es el precio
       * base del producto, es decir, el precio del restaurante.
       *
       * Ese precio NUNCA se muestra directamente al cliente.
       *
       * Para Discover usamos exactamente el mismo motor oficial
       * que utiliza el menú y la creación del pedido:
       *
       *     getCommissionConfig()
       *     getFinalPrice()
       *
       * De esta manera:
       *
       * - commission inactive
       *     -> cliente ve precio base
       *
       * - commission_type = "customer"
       *     -> cliente ve precio + comisión Wolf
       *
       * - commission_type = "restaurant"
       *     -> cliente ve precio base
       *
       * No duplicamos la fórmula aquí.
       */
      const commissionConfig =
        getCommissionConfig(restaurant);

      const items: CustomerOrderItem[] = (orderItems ?? [])
        .filter((item) => item.order_id === order.id)
        .map((item) => {
          const product = products?.find(
            (product) => product.id === item.product_id
          );

          /*
           * Precio BASE:
           *
           * Este es el precio que estaba guardado en el pedido.
           * NO se entrega directamente a la UI.
           */
          const baseUnitPrice =
            Number(item.unit_price) || 0;

          /*
           * Precio FINAL visible para el cliente.
           *
           * Esta es la misma función utilizada por
           * el resto del sistema.
           */
          const displayUnitPrice =
            getFinalPrice(
              baseUnitPrice,
              commissionConfig
            );

          const quantity =
            Number(item.quantity) || 0;

          /*
           * Total visible de esta línea.
           */
          const displayTotal =
            Number(
              (
                displayUnitPrice * quantity
              ).toFixed(2)
            );

          return {
            id: `${order.id}-${item.product_id}`,
            name: product?.name ?? "Producto",
            quantity,
            unit_price: displayUnitPrice,
            total_price: displayTotal,
          };
        });

      return {
        id: order.id,
        order_number:
          order.tracking_code ?? order.id.slice(0, 8),

        restaurant: {
          id: restaurant?.id ?? order.restaurant_id,
          name: restaurant?.name ?? "Restaurante",
          logo_url: restaurant?.logo_url ?? null,
        },

        created_at: order.created_at,

        status: normalizeOrderStatus(order.status),

        items,

        /*
         * El total real del pedido ya viene calculado
         * por el motor al momento de crear la orden.
         *
         * No lo recalculamos aquí.
         */
        total: Number(order.total),

        timeline: buildTimeline(order),
      };
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

  return result;
}