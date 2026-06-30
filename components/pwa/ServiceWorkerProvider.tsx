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

        // Solicitar permisos solo si no han sido otorgados previamente
        if ("Notification" in window && Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          
          if (permission === "granted" && reg.pushManager) {
            try {
              const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
              });

              await fetch("/api/notifications/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription }),
              });
              console.log("Suscripción a notificaciones exitosa");
            } catch (err) {
              console.error("Error al registrar push:", err);
            }
          }
        }
      });
    }

    // Manejo del prompt de instalación (PWA)
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  return null;
}