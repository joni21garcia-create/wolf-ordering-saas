"use client";
import { UploadResult } from "@/types/pwa";
import { useState } from "react";
// Eliminamos la importación de useManagerPWASettings ya que no debe forzar el refresco aquí

export function useManagerLogoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
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

if (json.success) {

  setProgress(100);

  return json;

}

return {
  success: false,
  error: json.error ?? "Error desconocido."
};

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


