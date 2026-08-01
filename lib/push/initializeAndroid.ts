/*
==========================================================

Wolf Ordering Push V2

Inicialización Android

==========================================================
*/

import { PushNotifications } from "@capacitor/push-notifications";

interface InitializeAndroidInput {
  restaurantId: string;
  userId?: string;
}

let initialized = false;

export async function initializeAndroid({
  restaurantId,
  userId,
}: InitializeAndroidInput) {

  if (initialized) return;

  initialized = true;

  console.log("=================================");
  console.log("[ANDROID] Inicializando...");
  console.log("Restaurant:", restaurantId);
  console.log("User:", userId ?? "CLIENT");
  console.log("=================================");

  /*
  ==========================================================
  PERMISOS
  ==========================================================
  */

  let permission =
    await PushNotifications.checkPermissions();

  console.log(
    "[ANDROID] Permiso:",
    permission.receive
  );

  if (permission.receive === "prompt") {

    permission =
      await PushNotifications.requestPermissions();

    console.log(
      "[ANDROID] Nuevo permiso:",
      permission.receive
    );

  }

  if (permission.receive !== "granted") {

    console.warn(
      "[ANDROID] Permiso denegado."
    );

    return;

  }

  /*
  ==========================================================
  LISTENERS
  ==========================================================
  */

  PushNotifications.removeAllListeners();

  PushNotifications.addListener(
    "registration",
    async ({ value }) => {

      console.log(
        "[ANDROID] Token recibido:"
      );

      console.log(value);

      /*
      ==========================================================
      GUARDAR TOKEN LOCALMENTE
      ==========================================================
      */

      localStorage.setItem(
        "wolf_android_token",
        value
      );

      console.log(
        "[ANDROID] Token guardado localmente."
      );

    }
  );

  PushNotifications.addListener(
    "registrationError",
    (error) => {

      console.error(
        "[ANDROID] Error registrando:",
        error
      );

    }
  );

  /*
  ==========================================================
  REGISTRAR EN FIREBASE
  ==========================================================
  */

  console.log(
    "[ANDROID] Solicitando token FCM..."
  );

  await PushNotifications.register();

  console.log(
    "[ANDROID] Registro solicitado."
  );

}