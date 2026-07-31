import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { messaging } from "@/lib/firebase-admin";

import {
  CustomerOrderStatus,
} from "@/lib/push/customerMessages";

import {
  buildCustomerNotification,
} from "@/lib/push/buildCustomerNotification";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CustomerPushParams {
  orderId: string;
  status: CustomerOrderStatus;
}

export async function sendCustomerPush({
  orderId,
  status,
}: CustomerPushParams) {

  try {

    /*
    ==========================================================
    CONSTRUIR NOTIFICACIÓN
    ==========================================================
    */

    const notification =
      await buildCustomerNotification({
        orderId,
        status,
      });

    if (!notification) {
      console.log(
        "[CUSTOMER PUSH] No fue posible construir la notificación."
      );
      return;
    }

    /*
    ==========================================================
    OBTENER DISPOSITIVO
    ==========================================================
    */

    const {
      data: device,
      error,
    } = await supabase

      .from("push_subscriptions")

      .select(`
        id,
        subscription,
        fcm_token,
        active
      `)

      .eq(
        "id",
        notification.pushSubscriptionId
      )

      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!device) {
      console.log(
        "[CUSTOMER PUSH] Dispositivo no encontrado."
      );
      return;
    }

    /*
    ==========================================================
    WEB PUSH
    ==========================================================
    */

    if (device.subscription) {

      try {

        await webpush.sendNotification(

          device.subscription,

          JSON.stringify({

            title:
              notification.title,

            body:
              notification.body,

            icon:
              notification.icon,

            badge:
              notification.icon,

            image:
              notification.image,

            url:
              notification.url,

          })

        );

        console.log(
          "[CUSTOMER PUSH] Web Push enviado."
        );

      } catch (err: any) {

        console.error(
          "[CUSTOMER PUSH][WEB]",
          err
        );

        if (
          err?.statusCode === 404 ||
          err?.statusCode === 410
        ) {

          await supabase

            .from("push_subscriptions")

            .update({
              active: false,
            })

            .eq(
              "id",
              device.id
            );

        }

      }

    }

    /*
    ==========================================================
    FIREBASE (ANDROID)
    ==========================================================
    */

    if (device.fcm_token) {

      try {

        const id =
          await messaging.send({

            token:
              device.fcm_token,

            notification: {

              title:
                notification.title,

              body:
                notification.body,

              imageUrl:
                notification.image,

            },

            data: {

              url:
                notification.url,

            },

            android: {

              priority: "high",

              notification: {

                channelId: "orders",

                sound: "default",

                imageUrl:
                  notification.image,

              },

            },

          });

        console.log(
          "[CUSTOMER PUSH] FCM enviado:",
          id
        );

      } catch (err) {

        console.error(
          "[CUSTOMER PUSH][FCM]",
          err
        );

      }

    }

  } catch (error) {

    console.error(
      "[CUSTOMER PUSH]",
      error
    );

  }

}