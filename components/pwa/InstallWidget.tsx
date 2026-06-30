"use client";
import { useInstall } from "./InstallProvider";

export default function InstallWidget() {
  const deferredPrompt = useInstall();

  // FORZAMOS LA VISIBILIDAD PARA PROBAR:
  // Si quitas el 'if (!deferredPrompt)', el botón debería salir siempre.
  // Vamos a quitar el if temporalmente para ver si el botón aparece.
  
  return (
    <button
      onClick={() => deferredPrompt?.prompt()}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 99999, // Aumenté el Z-Index por si acaso
        padding: "15px 25px",
        background: "#f97316",
        color: "white",
        borderRadius: "50px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
      }}
    >
      {deferredPrompt ? "Instalar App" : "Esperando PWA..."}
    </button>
  );
}