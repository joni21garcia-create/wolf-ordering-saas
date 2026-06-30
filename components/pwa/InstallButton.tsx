"use client";
import { useEffect, useState } from "react";

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <button 
      onClick={handleInstall}
      style={{
        marginTop: "20px",
        padding: "12px 20px",
        borderRadius: "12px",
        background: "#f97316",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        width: "100%"
      }}
    >
      Instalar App en tu dispositivo
    </button>
  );
}