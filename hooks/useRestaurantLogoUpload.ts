"use client";
import { RestaurantPWASettings, UploadResult } from "@/types/pwa";
import { useState } from "react";

// Definimos la interfaz específica de este hook que extiende de la base
interface UploadLogoResponse extends UploadResult {
  success: boolean;
  logo?: {
    url: string;
    path: string;
  };
  icons?: any[];
  settings?: any;
  message?: string;
  error?: string;
}

export function useRestaurantLogoUpload(restaurantId: string) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function uploadLogo(file: File): Promise<UploadLogoResponse> {
    try {
      setUploading(true);
      setProgress(10);

      if (!file.type.startsWith("image/")) {
        return {
          success: false,
          error: "Debe ser una imagen.",
          url: "", // Requerido si UploadResult lo exige
          path: ""
        };
      }

      setProgress(25);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("restaurantId", restaurantId);

      setProgress(45);

      const response = await fetch("/api/pwa/upload-logo", {
        method: "POST",
        body: formData,
      });

      setProgress(80);

      const json = await response.json();

      setProgress(100);
      return json;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: "Error subiendo logo.",
        url: "",
        path: ""
      };
    } finally {
      setUploading(false);
      setTimeout(() => {
        setProgress(0);
      }, 600);
    }
  }

  return {
    uploading,
    progress,
    uploadLogo,
  };
}