/*
==========================================================

Wolf Ordering

Tracking Page

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

import TrackingRealtime from "@/components/tracking/TrackingRealtime";
import TrackingStatus from "@/components/tracking/TrackingStatus";
import TrackingInfo from "@/components/tracking/TrackingInfo";

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

  const { code } =
    await params;

  /*
  ==========================================================
  PEDIDO
  ==========================================================
  */

  const {
    data: order,
  } = await supabase
    .from("orders")
    .select("*")
    .eq(
      "tracking_code",
      code
    )
    .maybeSingle();

  if (!order) {

    return (

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
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
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >

      <TrackingRealtime
        orderId={order.id}
      />

      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Seguimiento del pedido
      </h1>

      <TrackingInfo
        order={order}
        restaurantSlug={
          restaurant?.slug
        }
        deliverySettings={
          deliverySettings
        }
      />

      <TrackingStatus
        status={order.status}
      />

    </main>

  );

}