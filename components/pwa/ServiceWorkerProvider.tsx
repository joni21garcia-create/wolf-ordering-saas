"use client";

import { useEffect, useRef } from "react";
import { registerSW } from "@/lib/pwa/registerSW";

export default function ServiceWorkerProvider() {
  // Usamos una ref para evitar múltiples registros innecesarios
  const hasRegistered = useRef(false);

  useEffect(() => {
    if (hasRegistered.current) return;
    
    if ("serviceWorker" in navigator) {
      // Registramos una sola vez al montar la app
      registerSW("/sw.js").then(() => {
        hasRegistered.current = true;
      });
    }
  }, []); // Solo se ejecuta al montar la aplicación

  return null;
}