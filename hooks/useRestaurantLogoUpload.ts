"use client";

import { useState } from "react";

interface UploadResult {
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

export function useRestaurantLogoUpload(
  restaurantId: string
) {
  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    progress,
    setProgress,
  ] =
    useState(0);

  async function uploadLogo(
    file: File
  ): Promise<UploadResult> {

    try {

      setUploading(true);

      setProgress(10);

      /*
       Validaciones
      */

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        return {

          success: false,

          error:
            "Debe ser una imagen.",

        };

      }

      setProgress(25);

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

      setProgress(45);

      const response =
        await fetch(
          "/api/pwa/upload-logo",
          {

            method: "POST",

            body: formData,

          }
        );

      setProgress(80);

      const json =
        await response.json();

      setProgress(100);

      return json;

    } catch (error) {

      console.error(error);

      return {

        success: false,

        error:
          "Error subiendo logo.",

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