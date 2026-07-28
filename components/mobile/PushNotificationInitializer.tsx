"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { initializePushNotifications } from "@/modules/reservations/services/pushNotifications";
import { requestAppPermissions } from "@/modules/mobile/services/mobilePermissions";

export default function PushNotificationInitializer() {
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      console.log("🔥 PushNotificationInitializer montado");

      try {
        // Solicita los permisos necesarios
        await requestAppPermissions();

        // Inicializa las notificaciones push
        await initializePushNotifications((url) => {
          console.log("[PUSH] Navegando a:", url);

          router.push(url);
        });
      } catch (error) {
        console.error("[APP] Error inicializando:", error);
      }
    }

    initialize();
  }, [router]);

  return null;
}