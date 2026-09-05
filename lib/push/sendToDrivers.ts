/*
==========================================================
Wolf Ordering Push V2 - Notificaciones Repartidores
==========================================================
*/

import { createClient } from "@supabase/supabase-js";
import { messaging } from "@/lib/firebase-admin";
import { DriverPushInput } from "./types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function sendToDrivers({ title, body, data }: DriverPushInput) {
  try {
    // 1. Buscamos todos los tokens de repartidores Android activos
    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("fcm_token")
      .eq("platform", "android")
      .eq("active", true);

    if (error) throw error;
    if (!subs || subs.length === 0) {
      console.log("[DRIVER PUSH] No hay repartidores activos con token.");
      return;
    }

    const tokens = subs.map(s => s.fcm_token).filter(Boolean) as string[];

    // 2. Preparamos el mensaje para Firebase
    // Nota: El campo 'data' es vital para que Android active el "repique"
    const message = {
      notification: { title, body },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK", // Opcional, ayuda a abrir la app
      },
      tokens: tokens,
      android: {
        priority: "high" as const,
        notification: {
          sound: "default",
          channelId: "orders",
        }
      }
    };

    // 3. Envío masivo
    const response = await messaging.sendEachForMulticast(message);
    
    console.log("[DRIVER PUSH RESULT]", {
      successCount: response.successCount,
      failureCount: response.failureCount
    });

  } catch (error) {
    console.error("[DRIVER PUSH ERROR]", error);
  }
}