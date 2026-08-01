/*
==========================================================

Wolf Ordering Push V2

Notificaciones Cliente

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

import { pushEngine } from "./engine";

import { CustomerPushInput } from "./types";

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

);

export async function sendCustomer({

  orderId,

  body,

  url,

}: CustomerPushInput) {

  /*
  ==========================================================
  PEDIDO
  ==========================================================
  */

  const {

    data: order,

    error: orderError,

  } = await supabase

    .from("orders")

    .select(`
      push_subscription_id,
      tracking_code,
      restaurants (
        name
      )
    `)

    .eq("id", orderId)

    .maybeSingle();

  if (orderError) {

    console.error(
      "[CUSTOMER PUSH] Error pedido:",
      orderError
    );

    return;

  }

  if (!order?.push_subscription_id) {

    console.log(
      "[CUSTOMER PUSH] Pedido sin dispositivo."
    );

    return;

  }

  /*
  ==========================================================
  DISPOSITIVO
  ==========================================================
  */

  const {

    data: device,

    error: deviceError,

  } = await supabase

    .from("push_subscriptions")

    .select("*")

    .eq("id", order.push_subscription_id)

    .maybeSingle();

  if (deviceError) {

    console.error(
      "[CUSTOMER PUSH] Error dispositivo:",
      deviceError
    );

    return;

  }

  if (!device) {

    console.log(
      "[CUSTOMER PUSH] Dispositivo no encontrado."
    );

    return;

  }

  /*
  ==========================================================
  NOTIFICACIÓN
  ==========================================================
  */

  const restaurantName =
    (order as any)?.restaurants?.name ??
    "Wolf Ordering";

  const trackingCode =
    order.tracking_code ??
    "Pedido";

  const notificationTitle =
    `🍽️ ${restaurantName}`;

  const notificationBody =

`Pedido #${trackingCode}

${body}`;

  /*
  ==========================================================
  MOTOR
  ==========================================================
  */

  const result = await pushEngine(

    device,

    {

      title: notificationTitle,

      body: notificationBody,

      url,

    }

  );

  console.log(

    "[CUSTOMER PUSH RESULT]",

    result

  );

}