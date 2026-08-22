import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Printer } from "@capgo/capacitor-printer";

function isAndroid(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android"
  );
}

function cleanFileName(fileName: string): string {
  return fileName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, "-");
}

export async function saveBase64FileOnAndroid(
  base64: string,
  fileName: string,
  mimeType: string,
): Promise<void> {
  if (!isAndroid()) {
    throw new Error(
      "Esta función solo está disponible en Android.",
    );
  }

  const safeName = cleanFileName(fileName);

  const result = await Filesystem.writeFile({
    path: safeName,
    data: base64,
    directory: Directory.Cache,
  });

  try {
    await Share.share({
      title: safeName,
      text: "Archivo generado por Wolf Ordering",
      url: result.uri,
      dialogTitle: "Guardar o compartir archivo",
    });
  } catch (error) {
    console.warn(
      "No fue posible abrir compartir:",
      error,
    );
  }
}

export async function openPdfOnAndroid(
  base64: string,
  fileName: string,
): Promise<void> {
  if (!isAndroid()) {
    throw new Error(
      "Esta función solo está disponible en Android.",
    );
  }

  await Printer.printBase64({
    data: base64,
    name: fileName,
    mimeType: "application/pdf",
  });
}