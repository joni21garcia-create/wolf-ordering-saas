import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { messaging } from "@/lib/firebase-admin";

webpush.setVapidDetails(
  "mailto:admin@wolfordering.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CustomerPushParams {
  orderId: string;
  title: string;
  body: string;
  url?: string;
}

export async function sendCustomerPush({
  orderId,
  title,
  body,
  url,
}: CustomerPushParams) {
  try {
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
      .select("push_subscription_id")
      .eq("id", orderId)
      .maybeSingle();

    if (orderError) throw orderError;

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
      data: subscription,
      error: subscriptionError,
    } = await supabase
      .from("push_subscriptions")
      .select(`
        subscription,
        fcm_token,
        platform
      `)
      .eq("id", order.push_subscription_id)
      .maybeSingle();

    if (subscriptionError) throw subscriptionError;

    if (!subscription) {
      console.log(
        "[CUSTOMER PUSH] Dispositivo no encontrado."
      );
      return;
    }

    /*
    ==========================================================
    WEB PUSH (PWA)
    ==========================================================
    */

    if (subscription.subscription) {
      try {
        await webpush.sendNotification(
          subscription.subscription,
          JSON.stringify({
            title,
            body,
            url,
          })
        );

        console.log(
          "[CUSTOMER PUSH] Web Push enviado."
        );
      } catch (err) {
        console.error(
          "[CUSTOMER PUSH][WEB]",
          err
        );
      }
    }

    /*
    ==========================================================
    FIREBASE (ANDROID)
    ==========================================================
    */

    if (subscription.fcm_token) {
      try {
        const id = await messaging.send({
          token: subscription.fcm_token,

          notification: {
            title,
            body,
          },

          data: {
            url: url ?? "/",
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