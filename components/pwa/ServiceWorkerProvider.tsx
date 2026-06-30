"use client";

import { useEffect, useRef } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;

    // 1. Registro del Service Worker
    if ("serviceWorker" in navigator) {
      registerSW("/sw.js").then(async (registration) => {
        hasRegistered.current = true;

        // 2. Solicitud de Permiso y Suscripción a Push Notifications
        if ("Notification" in window && Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          
          if (permission === "granted") {
            try {
              // Suscribir al Manager a las notificaciones Push
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                // IMPORTANTE: Asegúrate de tener tu VAPID_PUBLIC_KEY en tus env variables
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              });

              // Guardar la suscripción en tu base de datos para enviar pedidos
              await fetch("/api/notifications/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription }),
              });
              
              console.log("Manager suscrito a notificaciones push");
            } catch (err) {
              console.error("Error al suscribir a notificaciones:", err);
            }
          }
        }
      });
    }

    // 3. Captura del evento de instalación (Popup Nativo)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      console.log("Evento de instalación capturado");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}