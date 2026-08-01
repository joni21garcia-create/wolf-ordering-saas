/*
==========================================================

Wolf Ordering Push V2

Motor de envío

==========================================================
*/

import webpush from "web-push";
import { messaging } from "@/lib/firebase-admin";

import {
  PushPayload,
  PushEngineResult,
  PushSubscriptionDevice,
} from "./types";

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
  WEB PUSH
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

      console.error("[ENGINE] WEB PUSH ERROR", error);

    }

  }

  /*
  ==========================================================
  FIREBASE (ANDROID)
  ==========================================================
  */

  if (device.fcm_token) {

    try {

      console.log("[ENGINE] FIREBASE");

      await messaging.send({

        token: device.fcm_token,

        notification: {
          title: payload.title,
          body: payload.body,
        },

        data: {
          url: payload.url ?? "/",
        },

        android: {
          priority: "high",
          notification: {
            channelId: "orders",
            sound: "default",
          },
        },

      });

      android = true;

    } catch (error) {

      console.error("[ENGINE] FCM ERROR", error);

    }

  }

  return {
    web,
    android,
  };

}