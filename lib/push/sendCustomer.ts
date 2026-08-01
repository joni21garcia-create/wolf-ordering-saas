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

  title,

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

  } = await supabase

    .from("orders")

    .select("push_subscription_id")

    .eq("id", orderId)

    .maybeSingle();

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

  } = await supabase

    .from("push_subscriptions")

    .select("*")

    .eq("id", order.push_subscription_id)

    .maybeSingle();

  if (!device) {

    console.log(

      "[CUSTOMER PUSH] Dispositivo no encontrado."

    );

    return;

  }

  /*
  ==========================================================
  MOTOR
  ==========================================================
  */

  const result = await pushEngine(

    device,

    {

      title,

      body,

      url,

    }

  );

  console.log(

    "[CUSTOMER PUSH RESULT]",

    result

  );

}