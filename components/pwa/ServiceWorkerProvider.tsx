"use client";

import { useEffect, useRef } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;
    
    if ("serviceWorker" in navigator) {
      registerSW("/sw.js").then(async (registration) => {
        hasRegistered.current = true;
        
        // Solicitar permiso de notificaciones una vez registrado el SW
        if ("Notification" in window && Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          
          if (permission === "granted") {
            console.log("Notificaciones permitidas");
            // Aquí podrías llamar a una función para enviar la suscripción a tu BD
            // subscribeUserToPush(registration);
          }
        }
      });
    }
  }, []);

  return null;
}