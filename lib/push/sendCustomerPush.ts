import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

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

    // Buscar el pedido
    const { data: order, error: orderError } =
      await supabase
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

    // Buscar la suscripción
    const {
      data: subscription,
      error: subscriptionError,
    } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("id", order.push_subscription_id)
      .maybeSingle();

    if (subscriptionError)
      throw subscriptionError;

    if (!subscription) {
      console.log(
        "[CUSTOMER PUSH] Suscripción no encontrada."
      );
      return;
    }

    await webpush.sendNotification(
      subscription.subscription,
      JSON.stringify({
        title,
        body,
        url,
      })
    );

    console.log(
      "[CUSTOMER PUSH] Enviado correctamente."
    );

  } catch (error) {

    console.error(
      "[CUSTOMER PUSH]",
      error
    );

  }
}


