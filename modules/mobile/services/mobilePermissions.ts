import { Camera } from "@capacitor/camera";
import { Geolocation } from "@capacitor/geolocation";
import { PushNotifications } from "@capacitor/push-notifications";

export async function requestAppPermissions() {
  try {
    console.log("[PERMISSIONS] Solicitando permisos...");

    // Notificaciones
    await PushNotifications.requestPermissions();

    // Cámara y galería
    await Camera.requestPermissions();

    // Ubicación
    await Geolocation.requestPermissions();

    console.log("[PERMISSIONS] Permisos verificados.");
  } catch (error) {
    console.error("[PERMISSIONS]", error);
  }
}