import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

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
  const { data: subscriptions, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .eq("active", true);

  if (error) {
    console.error("Error obteniendo suscripciones:", error);
    return;
  }

  if (!subscriptions?.length) {
    console.log("No existen dispositivos registrados.");
    return;
  }

  let enviados = 0;

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

      enviados++;
    } catch (err: any) {
      console.error(
        "Error enviando Push:",
        err?.statusCode,
        err?.message
      );

      if (err?.statusCode === 404 || err?.statusCode === 410) {
        await supabase
          .from("push_subscriptions")
          .update({
            active: false,
          })
          .eq("id", device.id);
      }
    }
  }

  console.log(
    `Push enviadas correctamente: ${enviados}`
  );
}