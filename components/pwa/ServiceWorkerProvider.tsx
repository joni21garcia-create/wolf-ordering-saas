"use client";

import { useEffect, useRef } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;

    if ("serviceWorker" in navigator) {
      registerSW("/sw.js").then(async (registration: unknown) => {
        hasRegistered.current = true;
        const reg = registration as ServiceWorkerRegistration;

        if ("Notification" in window) {
          const permission = await Notification.requestPermission();
          console.log("Permiso de notificación:", permission); // DEBUG 1

          if (permission === "granted" && reg.pushManager) {
            try {
              const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              });

              console.log("Suscripción obtenida:", subscription); // DEBUG 2

              const response = await fetch("/api/notifications/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription }),
              });

              const result = await response.json();
              console.log("Respuesta del servidor:", result); // DEBUG 3
            } catch (err) {
              console.error("Error al registrar push:", err); // DEBUG 4
            }
          }
        }
      });
    }
  }, []);

  return null;
}