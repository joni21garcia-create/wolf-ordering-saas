"use client";

import { Capacitor, registerPlugin } from "@capacitor/core";
import React from "react";

interface WolfDownloadPlugin {
  saveToDownloads(options: {
    data: string;
    fileName: string;
    mimeType: string;
  }): Promise<{
    success: boolean;
    uri?: string;
    fileName?: string;
  }>;
}

const WolfDownload = registerPlugin<WolfDownloadPlugin>("WolfDownload");

interface Props {
  url: string;
  fileName?: string;
  className?: string;
  children: React.ReactNode;
  onError?: (message: string) => void;
}

function safeFileName(value: string): string {
  return (
    value
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100) || "comprobante-pago"
  );
}

function extensionFromContentType(type: string): string {
  const value = type.toLowerCase();

  if (value.includes("png")) return "png";
  if (value.includes("webp")) return "webp";
  if (value.includes("gif")) return "gif";
  if (value.includes("pdf")) return "pdf";

  return "jpg";
}

function base64FromArrayBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize)
    );
  }

  return btoa(binary);
}

export default function ProofDownloadButton({
  url,
  fileName = "comprobante-pago",
  className,
  children,
  onError,
}: Props) {
  async function downloadProof() {
    if (!url) return;

    try {
      // Descarga siempre mediante la API del proyecto.
      // La API obtiene el comprobante desde Cloudflare R2.
      const endpoint =
        `/api/orders/proof/download?url=${encodeURIComponent(url)}`;

      const response = await fetch(endpoint, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          `No se pudo descargar el comprobante (${response.status})`
        );
      }

      const contentType =
        response.headers.get("content-type") || "image/jpeg";

      const disposition =
        response.headers.get("content-disposition") || "";

      const match =
        disposition.match(/filename="?([^";]+)"?/i);

      const serverName = match?.[1] || "";
      const baseName = serverName || fileName;

      const nameWithoutExtension = baseName.replace(
        /\.[a-z0-9]+$/i,
        ""
      );

      const safeBase = safeFileName(nameWithoutExtension);

      const extension = extensionFromContentType(contentType);

      const finalName = `${safeBase}.${extension}`;

      const buffer = await response.arrayBuffer();

      // ANDROID NATIVO:
      // Guardar directamente en la carpeta pública Downloads
      // mediante WolfDownloadPlugin + MediaStore.
      if (
        Capacitor.isNativePlatform() &&
        Capacitor.getPlatform() === "android"
      ) {
        await WolfDownload.saveToDownloads({
          data: base64FromArrayBuffer(buffer),
          fileName: finalName,
          mimeType: contentType,
        });

        return;
      }

      // WEB + PWA:
      // Mantener el flujo actual que ya funciona.
      const blob = new Blob([buffer], {
        type: contentType,
      });

      const objectUrl = URL.createObjectURL(blob);

      const anchor = document.createElement("a");

      anchor.href = objectUrl;
      anchor.download = finalName;
      anchor.rel = "noopener";
      anchor.style.display = "none";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      console.error("[ProofDownloadButton]", error);

      onError?.(
        "No se pudo descargar el comprobante. Intenta nuevamente."
      );
    }
  }

  return (
    <button
      type="button"
      onClick={downloadProof}
      className={className}
    >
      {children}
    </button>
  );
}