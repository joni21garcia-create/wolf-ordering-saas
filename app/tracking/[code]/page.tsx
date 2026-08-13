/*
==========================================================

Wolf Ordering

Tracking Page

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

import TrackingLive from "@/components/tracking/TrackingLive";
import TrackingOrderItems from "@/components/tracking/TrackingOrderItems";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{
    code: string;
  }>;
}

export default async function TrackingPage({
  params,
}: Props) {

  const { code } = await params;

  /*
  ==========================================================
  PEDIDO
  ==========================================================
  */

  const {
    data: order,
    error,
  } = await supabase
    .from("orders")
    .select("*")
    .eq(
      "tracking_code",
      code
    )
    .maybeSingle();

  if (error) {

    console.error(error);

  }

  if (!order) {

    return (

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          padding: 20,
        }}
      >

        <h1>
          Pedido no encontrado
        </h1>

      </main>

    );

  }

  /*
  ==========================================================
  PRODUCTOS DEL PEDIDO
  ==========================================================
  */

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      unit_price,
      subtotal,

      products(
        id,
        name,
        image_url
      )
    `)
    .eq(
      "order_id",
      order.id
    );

  if (itemsError) {

    console.error(itemsError);

  }

  /*
  ==========================================================
  RESTAURANTE
  ==========================================================
  */

  const {
    data: restaurant,
  } = await supabase
    .from("restaurants")
    .select("slug")
    .eq(
      "id",
      order.restaurant_id
    )
    .maybeSingle();

  /*
  ==========================================================
  CONFIGURACIÓN DELIVERY
  ==========================================================
  */

  const {
    data: deliverySettings,
  } = await supabase
    .from(
      "restaurant_delivery_settings"
    )
    .select("*")
    .eq(
      "restaurant_id",
      order.restaurant_id
    )
    .maybeSingle();

  /*
  ==========================================================
  VIEW
  ==========================================================
  */

  return (

    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "60px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >

      <TrackingLive
        initialOrder={order}
        restaurantSlug={restaurant?.slug}
        deliverySettings={deliverySettings}
      />

      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          margin: 0,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: ".3px",
        }}
      >
        Seguimiento del pedido
      </h1>

      <TrackingOrderItems
        items={items ?? []}
        order={order}
      />

    </main>

  );

}