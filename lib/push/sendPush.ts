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

type SendPushParams = {
  restaurant_id: string;
  title: string;
  body: string;
  url?: string;
};

export async function sendPush({
  restaurant_id,
  title,
  body,
  url = "/admin/orders",
}: SendPushParams) {
  //
  // WEB PUSH
  //

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .eq("active", true);

  if (subscriptions?.length) {
    for (const device of subscriptions) {
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
        console.error("[WEB PUSH]", err);

        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await supabase
            .from("push_subscriptions")
            .update({ active: false })
            .eq("id", device.id);
        }
      }
    }
  }

  //
  // ANDROID FCM
  //

  const { data: devices } = await supabase
    .from("device_tokens")
    .select("fcm_token")
    .eq("restaurant_id", restaurant_id)
    .eq("active", true);

  console.log("[FCM] Dispositivos:", devices?.length ?? 0);

  if (devices?.length) {
    for (const device of devices) {
      try {
        const id = await messaging.send({
          token: device.fcm_token,

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

        console.log("[FCM] Enviado:", id);
      } catch (err) {
        console.error("[FCM] Error:", err);
      }
    }
  }
}