/*
==========================================================
Wolf Ordering Push V2 - Notificaciones Repartidores
Versión Alineada para Repique Persistente en Background
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

    /*
    ==========================================================
    CAMBIO CRÍTICO: FORMATO DATA-ONLY
    ==========================================================
    Eliminamos el objeto 'notification' de la raíz.
    Al enviar solo 'data', obligamos a Android a ejecutar el 
    código de la App (onMessageReceived) incluso en background.
    ==========================================================
    */
    const message = {
      data: {
        ...data,
        type: "NEW_ORDER", // Identificador para que la App sepa que debe sonar
        title: title,      // Pasamos el título dentro de data
        body: body,        // Pasamos el cuerpo dentro de data
        click_action: "FLUTTER_NOTIFICATION_CLICK",
      },
      tokens: tokens,
      android: {
        priority: "high" as const, // Prioridad máxima para despertar el dispositivo
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