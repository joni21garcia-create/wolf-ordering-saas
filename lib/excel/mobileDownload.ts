"use client";

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import * as XLSX from "xlsx";

/**
 * Guarda un libro XLSX en web/PWA o lo entrega mediante el selector nativo
 * de Android/iOS cuando Wolf está ejecutándose dentro de Capacitor.
 */
export async function saveExcelWorkbook(
  workbook: XLSX.WorkBook,
  filename: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    XLSX.writeFile(workbook, filename);
    return;
  }

  const data = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  }) as ArrayBuffer;

  const bytes = new Uint8Array(data);
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length))
    );
  }

  const base64 = btoa(binary);

  // Cache es intencional: Android entrega el archivo a la hoja nativa de
  // compartir/guardar y no dejamos archivos temporales en Documents.
  const path = `wolf/${filename}`;

  const written = await Filesystem.writeFile({
    path,
    data: base64,
    directory: Directory.Cache,
    recursive: true,
  });

  const shareSupport = await Share.canShare();

  if (!shareSupport.value) {
    throw new Error(
      "Android no tiene disponible el selector para guardar o compartir archivos."
    );
  }

  try {
    await Share.share({
      title: filename,
      files: [written.uri],
      dialogTitle: "Guardar o compartir Excel",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("cancel") || message.includes("dismiss")) return;
    throw error;
  }
}