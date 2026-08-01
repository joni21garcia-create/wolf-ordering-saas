/*
==========================================================

Wolf Ordering Push V2

Inicialización Android

==========================================================
*/

import { PushNotifications } from "@capacitor/push-notifications";

import { registerAndroid } from "./registerAndroid";

let initialized = false;

export async function initializeAndroid() {

  if (initialized) return;

  initialized = true;

  console.log("=================================");
  console.log("[ANDROID] Inicializando...");
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

  await PushNotifications.removeAllListeners();

  await PushNotifications.addListener(
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

      /*
      ==========================================================
      REGISTRAR DISPOSITIVO EN EL SERVIDOR
      ==========================================================
      */

      const registered =
        await registerAndroid({

          token: value,

          platform: "android",

        });

      if (registered) {

        console.log(
          "[ANDROID] Dispositivo registrado."
        );

      } else {

        console.error(
          "[ANDROID] No se pudo registrar el dispositivo."
        );

      }

    }
  );

  await PushNotifications.addListener(
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
  SOLICITAR TOKEN FCM
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