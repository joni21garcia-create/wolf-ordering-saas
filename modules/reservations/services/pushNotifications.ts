import { PushNotifications } from "@capacitor/push-notifications";

export async function initializePushNotifications() {
  console.log("🔥 Entró a initializePushNotifications()");

  try {
    console.log("[PUSH] Inicializando...");

    let permission = await PushNotifications.checkPermissions();
    console.log("[PUSH] Permisos actuales:", permission);

    if (permission.receive === "prompt") {
      permission = await PushNotifications.requestPermissions();
      console.log("[PUSH] Permisos después de solicitar:", permission);
    }

    if (permission.receive !== "granted") {
      console.log("[PUSH] Permiso denegado");
      return;
    }

    PushNotifications.addListener("registration", async (token) => {
      console.log("[PUSH] ✅ Token FCM:", token.value);
    });

    PushNotifications.addListener("registrationError", (error) => {
      console.error("[PUSH] ❌ registrationError:", error);
    });

    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("[PUSH] Notificación recibida:", notification);
    });

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification) => {
        console.log("[PUSH] Acción sobre notificación:", notification);
      }
    );

    console.log("[PUSH] Llamando a register()...");

    await PushNotifications.register();

    console.log("[PUSH] register() terminó.");
  } catch (err) {
    console.error("[PUSH] Error inicializando:", err);
  }
}