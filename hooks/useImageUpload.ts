"use client";

import { useState } from "react";

export type ImagePreset =
  | "logo"
  | "hero"
  | "gallery"
  | "product"
  | "category"
  | "promotion"
  | "banner";

interface UploadParams {
  file: File;
  restaurantId: string;
  preset: ImagePreset;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function useImageUpload() {
  const [uploading, setUploading] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  async function upload({
    file,
    restaurantId,
    preset,
  }: UploadParams): Promise<UploadResult> {
    try {
      setUploading(true);
      setProgress(10);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "restaurantId",
        restaurantId
      );

      formData.append(
        "preset",
        preset
      );

      setProgress(40);

      const response =
        await fetch(
          "/api/images/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      setProgress(80);

      const json =
        await response.json();

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      setProgress(100);

      return {
        success: true,
        url: json.url,
      };

    } catch (error: any) {

      console.error(error);

      return {
        success: false,
        error:
          error.message ??
          "Error subiendo imagen.",
      };

    } finally {

      setUploading(false);

      setTimeout(() => {
        setProgress(0);
      }, 300);
    }
  }

  return {
    upload,
    uploading,
    progress,
  };
}