import { PushNotifications } from "@capacitor/push-notifications";
import { App } from "@capacitor/app";

let initialized = false;

export async function initializePushNotifications(
  onNotificationClick?: (url: string) => void
) {
  if (initialized) {
    console.log("[PUSH] Ya inicializado.");
    return;
  }

  initialized = true;

  console.log("🔥 Entró a initializePushNotifications()");

  try {
    console.log("[PUSH] Inicializando...");

    let permission = await PushNotifications.checkPermissions();

    console.log(
      "[PUSH] Permisos actuales:",
      JSON.stringify(permission)
    );

    if (permission.receive === "prompt") {
      permission = await PushNotifications.requestPermissions();

      console.log(
        "[PUSH] Permisos después de solicitar:",
        JSON.stringify(permission)
      );
    }

    if (permission.receive !== "granted") {
      console.log("[PUSH] Permiso denegado");
      return;
    }

    // Elimina listeners anteriores por seguridad
    await PushNotifications.removeAllListeners();

    PushNotifications.addListener("registration", async (token) => {
      console.log("[PUSH] ✅ Token FCM:", token.value);

      try {
const response = await fetch("/api/push/register-customer-device", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  body: JSON.stringify({
    token: token.value,
    platform: "android",
  }),
});

const data = await response.json();

console.log("[PUSH] Registro:", data);

if (data.success && data.push_subscription_id) {
  localStorage.setItem(
    "wolf_push_subscription_id",
    data.push_subscription_id
  );

  console.log(
    "[PUSH] push_subscription_id guardado:",
    data.push_subscription_id
  );
}
      } catch (error) {
        console.error(error);
      }
    });

    PushNotifications.addListener(
      "registrationError",
      (error) => {
        console.error("[PUSH]", error);
      }
    );

    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification) => {
        console.log(
          "[PUSH] Recibida:",
          notification
        );
      }
    );

    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (event) => {
        console.log(
          "[PUSH] Click:",
          event
        );

const url = event.notification.data?.url;

if (!url) return;

console.log("[PUSH] Navegar:", url);

// Guardar la URL para recuperarla después del login
localStorage.setItem("pendingPushUrl", url);

// Espera un instante para asegurar que Next.js esté listo
requestAnimationFrame(() => {
  setTimeout(() => {
    onNotificationClick?.(url);
  }, 100);
});
      }
    );

    // Saber cuándo la app vuelve al foreground
    App.addListener("appStateChange", ({ isActive }) => {
      console.log(
        "[APP] Estado:",
        isActive ? "Foreground" : "Background"
      );
    });

    console.log("[PUSH] register()");

    await PushNotifications.register();

    console.log("[PUSH] register() OK");
  } catch (err) {
    console.error("[PUSH]", err);
  }
}