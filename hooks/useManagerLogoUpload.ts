"use client";

import { UploadResult } from "@/types/upload";
import { useState } from "react";
import { useManagerPWASettings } from "./useManagerPWASettings"; // Importamos el hook de settings

// ... (Interface UploadResult igual)

export function useManagerLogoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // 🛠️ Conectamos con el hook de settings para forzar un refresco
  const { refreshSettings } = useManagerPWASettings();

  async function uploadLogo(file: File): Promise<UploadResult> {
    try {
      setUploading(true);
      setProgress(10);

      if (!file.type.startsWith("image/")) {
        return { success: false, error: "El archivo debe ser una imagen válida." };
      }

      setProgress(25);
      const formData = new FormData();
      formData.append("file", file);

      setProgress(45);

      const response = await fetch("/api/pwa/upload-manager-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error de servidor: ${response.status}`);
      }

      setProgress(80);
      const json: UploadResult = await response.json();

      if (json.success && json.logo?.url) {
        // 🛠️ ¡LA CLAVE ESTÁ AQUÍ!
        // Al terminar con éxito, forzamos al sistema a recargar 
        // los nuevos iconos desde la BD inmediatamente.
        refreshSettings();
        
        setProgress(100);
        return json;
      } else {
        return { success: false, error: "Error: No se recibió la URL de la imagen." };
      }

    } catch (err) {
      console.error("Fallo crítico en uploadLogo:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Error desconocido.",
      };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 600);
    }
  }

  return {
    uploading,
    progress,
    uploadLogo,
  };
}