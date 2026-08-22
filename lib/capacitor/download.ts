import { Capacitor } from "@capacitor/core";
import { Printer } from "@capgo/capacitor-printer";

export function isAndroid(): boolean {
  return (
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android"
  );
}

export async function openPdfOnAndroid(
  base64: string,
  fileName: string
): Promise<void> {
  if (!isAndroid()) {
    throw new Error("Esta función solo está disponible en Android.");
  }

  await Printer.printBase64({
    data: base64,
    name: fileName,
    mimeType: "application/pdf",
  });
}