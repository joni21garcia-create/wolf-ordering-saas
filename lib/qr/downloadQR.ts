import { Capacitor } from "@capacitor/core";
import { saveBase64FileOnAndroid } from "@/lib/capacitor/download";

export async function downloadPNG(
  qrImage: string,
  restaurantName: string,
) {
  const fileName = `${restaurantName
    .replace(/\s+/g, "-")
    .toLowerCase()}-qr.png`;

  const isAndroid =
    Capacitor.isNativePlatform() &&
    Capacitor.getPlatform() === "android";

  if (isAndroid) {
    const base64 =
      qrImage.split(",")[1];

    if (!base64) {
      throw new Error(
        "No fue posible obtener el QR en Base64.",
      );
    }

    await saveBase64FileOnAndroid(
      base64,
      fileName,
      "image/png",
    );

    return;
  }

  const link =
    document.createElement("a");

  link.download = fileName;
  link.href = qrImage;

  document.body.appendChild(link);

  link.click();

  link.remove();
}