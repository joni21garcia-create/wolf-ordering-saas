/*
==========================================================

Wolf Ordering Push V2

Motor de envío

==========================================================
*/

import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

import { messaging } from "@/lib/firebase-admin";

import {
  PushPayload,
  PushEngineResult,
  PushSubscriptionDevice,
} from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function pushEngine(
  device: PushSubscriptionDevice,
  payload: PushPayload
): Promise<PushEngineResult> {

  let web = false;
  let android = false;

  /*
  ==========================================================
  WEB PUSH (PWA)
  ==========================================================
  */

  if (device.endpoint && device.subscription) {

    try {

      console.log("[ENGINE] WEB PUSH");

      await webpush.sendNotification(
        device.subscription as any,
        JSON.stringify(payload)
      );

      web = true;

    } catch (error: any) {

      console.error(
        "[ENGINE] WEB PUSH ERROR",
        error
      );

    }

  }

  /*
  ==========================================================
  FIREBASE (ANDROID)
  ==========================================================
  */

  if (device.fcm_token) {

    try {
console.log("[ENGINE] IMAGE:", payload.image);
console.log("[ENGINE] PAYLOAD:", payload);
await messaging.send({
  token: device.fcm_token,

  notification: {
    title: payload.title,
    body: payload.body,
    imageUrl: payload.image,
  },

  data: {
    url: payload.url ?? "/",
  },

  android: {
    priority: "high",

    notification: {
      channelId: "orders",
      sound: "default",
      icon: "ic_stat_wolf",
      imageUrl: payload.image,
    },
  },
});

      android = true;

    } catch (error: any) {

      console.error(
        "[ENGINE] FCM ERROR",
        error
      );

      /*
      ==========================================================
      TOKEN FCM INVÁLIDO
      ==========================================================
      */

      if (

        error?.code ===
          "messaging/registration-token-not-registered" ||

        error?.code ===
          "messaging/invalid-registration-token"

      ) {

        console.warn(
          "[ENGINE] Desactivando token FCM inválido."
        );

        await supabase
          .from("push_subscriptions")
          .update({

            active: false,

          })
          .eq("id", device.id);

      }

    }

  }

  return {

    web,

    android,

  };

}