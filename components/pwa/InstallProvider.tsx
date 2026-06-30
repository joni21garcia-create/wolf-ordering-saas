"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from "react";

// Definimos el tipo para que TypeScript no se queje
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Creamos el contexto para compartir el evento de instalación en toda la app
const InstallContext = createContext<BeforeInstallPromptEvent | null>(null);

export default function InstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Evita que el navegador muestre el banner automático (lo controlaremos nosotros)
      e.preventDefault();
      // Guardamos el evento para poder dispararlo con nuestro botón
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    
    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
    };
  }, []);

  return (
    <InstallContext.Provider value={deferredPrompt}>
      {children}
    </InstallContext.Provider>
  );
}

// Hook para usar el estado de instalación en cualquier componente
export const useInstall = () => {
  return useContext(InstallContext);
};