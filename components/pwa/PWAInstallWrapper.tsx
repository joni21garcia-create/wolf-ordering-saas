"use client";

import { useEffect, useState } from "react";
import { InstallButton } from "./InstallButton"; // Importamos tu botón original

export function PWAInstallWrapper() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Escuchamos el evento nativo de PWA
    const handler = (e: any) => {
      e.preventDefault();
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Si el navegador no permite instalar la app, no renderizamos nada
  if (!isInstallable) return null;

  // Si es instalable, devolvemos el botón
  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      <InstallButton />
    </div>
  );
}