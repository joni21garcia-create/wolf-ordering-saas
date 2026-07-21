"use client";

import { useEffect } from "react";

export default function RegisterSW() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("¡Service Worker registrado con éxito!", reg.scope);
        })
        .catch((err) => {
          console.error("Error al registrar el Service Worker:", err);
        });
    }
  }, []);

  return null; // Este componente no renderiza nada visual, solo ejecuta el registro
}


