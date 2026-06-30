"use client";

import { useEffect, useRef } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;

    if ("serviceWorker" in navigator) {
      // Usamos 'as any' en la resolución de la promesa
      registerSW("/sw.js").then(async (registration: any) => {
        hasRegistered.current = true;

        if ("Notification" in window && Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          
          if (permission === "granted") {
            try {
              // Convertimos explícitamente a ServiceWorkerRegistration para TS
              const reg = registration as ServiceWorkerRegistration;
              
              if (reg.pushManager) {
                const subscription = await reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
                });

                await fetch("/api/notifications/save", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ subscription }),
                });
                console.log("Manager suscrito a notificaciones push");
              }
            } catch (err) {
              console.error("Error al suscribir a notificaciones:", err);
            }
          }
        }
      });
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  return null;
}