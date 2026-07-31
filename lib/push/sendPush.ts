import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { messaging } from "@/lib/firebase-admin";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface SendPushParams {
  restaurant_id: string;
  title: string;
  body: string;
  url?: string;
}

export async function sendPush({
  restaurant_id,
  title,
  body,
  url = "/admin/orders",
}: SendPushParams) {

  /*
  ==========================================================
  WEB PUSH (PWA)
  ==========================================================
  */

  const {
    data: subscriptions,
  } = await supabase

    .from("push_subscriptions")

    .select("*")

    .eq(
      "restaurant_id",
      restaurant_id
    )

    .eq(
      "active",
      true
    );

  if (subscriptions?.length) {

    for (const device of subscriptions) {

      if (!device.subscription) continue;

      try {

        await webpush.sendNotification(

          device.subscription,

          JSON.stringify({

            title,

            body,

            url,

          })

        );

      } catch (err: any) {

        console.error(
          "[WEB PUSH]",
          err
        );

        /*
        El navegador eliminó la suscripción.
        */

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

  }

  /*
  ==========================================================
  FIREBASE (ANDROID)
  ==========================================================
  */

  const {
    data: devices,
  } = await supabase

    .from("push_subscriptions")

    .select(`
      id,
      fcm_token,
      active
    `)

    .eq(
      "restaurant_id",
      restaurant_id
    )

    .eq(
      "active",
      true
    )

    .not(
      "fcm_token",
      "is",
      null
    );

  if (devices?.length) {

    for (const device of devices) {

      try {

        const id =
          await messaging.send({

            token:
              device.fcm_token,

            notification: {

              title,

              body,

            },

            data: {

              url,

            },

            android: {

              priority: "high",

              notification: {

                channelId: "orders",

                sound: "default",

              },

            },

          });

        console.log(
          "[FCM]",
          id
        );

      } catch (err: any) {

        console.error(
          "[FCM]",
          err
        );

        /*
        Token inválido.
        */

        const code =
          err?.errorInfo?.code;

        if (

          code ===
            "messaging/registration-token-not-registered" ||

          code ===
            "messaging/invalid-registration-token"

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

  }

}