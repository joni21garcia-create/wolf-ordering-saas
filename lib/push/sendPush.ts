import { createClient } from "@supabase/supabase-js";
import { pushEngine } from "@/lib/push/engine";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

  console.log("=================================");
  console.log("[SEND PUSH] INICIO");
  console.log("Restaurant:", restaurant_id);
  console.log("=================================");

  const { data: devices, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("restaurant_id", restaurant_id)
    .eq("active", true);

  if (error) {
    console.error("[SEND PUSH] Error consultando push_subscriptions");
    console.error(error);
    return;
  }

  console.log(
    "[SEND PUSH] Dispositivos encontrados:",
    devices?.length ?? 0
  );

  if (!devices?.length) {
    console.log("[SEND PUSH] No hay dispositivos registrados.");
    return;
  }

  for (const device of devices) {

    console.log("------------------------");
    console.log("ID:", device.id);
    console.log("Platform:", device.platform);
    console.log("Endpoint:", !!device.endpoint);
    console.log("FCM:", !!device.fcm_token);

const result = await pushEngine(device, {
  title,
  body,
  url,
  icon: "/icons/push/wolf.png",
  badge: "/icons/badge/wolf.png",
});

    console.log("[SEND PUSH] Resultado:", result);

    // Solo desactivar suscripciones Web inválidas
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

      console.log(
        "[SEND PUSH] Suscripción desactivada:",
        device.id
      );
    }
  }

  console.log("[SEND PUSH] FIN");
}