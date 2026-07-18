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

      if (json.success && json.logo?.url) {
        // ✅ CORRECCIÓN: Eliminamos refreshSettings() para evitar el bucle infinito.
        // La UI debería reaccionar al cambio de estado localmente o mediante 
        // el evento que disparó la subida.
        
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