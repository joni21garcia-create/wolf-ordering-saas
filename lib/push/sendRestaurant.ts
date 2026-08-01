/*
==========================================================

Wolf Ordering Push V2

Notificaciones Restaurante

==========================================================
*/

import { createClient } from "@supabase/supabase-js";

import { pushEngine } from "./engine";

import { RestaurantPushInput } from "./types";

const supabase = createClient(

  process.env.NEXT_PUBLIC_SUPABASE_URL!,

  process.env.SUPABASE_SERVICE_ROLE_KEY!

);

export async function sendRestaurant({

  restaurantId,

  title,

  body,

  url = "/admin/orders",

}: RestaurantPushInput) {

  const {

    data: devices,

    error,

  } = await supabase

    .from("push_subscriptions")

    .select("*")

    .eq("restaurant_id", restaurantId)

    .eq("active", true);

  if (error) {

    console.error("[RESTAURANT PUSH]", error);

    return;

  }

  console.log(

    "[RESTAURANT PUSH] DISPOSITIVOS:",

    devices?.length ?? 0

  );

  if (!devices?.length) return;

  for (const device of devices) {

    const result = await pushEngine(

      device,

      {

        title,

        body,

        url,

      }

    );

    console.log(

      "[RESTAURANT PUSH RESULT]",

      result

    );

    // Solo desactivar Web Push inválido
    if (

      device.endpoint &&

      !result.web

    ) {

      await supabase

        .from("push_subscriptions")

        .update({

          active: false,

        })

        .eq("id", device.id);

    }

  }

}