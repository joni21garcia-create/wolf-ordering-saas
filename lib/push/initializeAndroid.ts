/*
==========================================================

Wolf Ordering Push V2

Inicialización Android

==========================================================
*/

import { PushNotifications } from "@capacitor/push-notifications";

import { registerAndroid } from "./registerAndroid";

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

  console.log("[ANDROID] Inicializando...");

  let permission =
    await PushNotifications.checkPermissions();

  if (permission.receive === "prompt") {

    permission =
      await PushNotifications.requestPermissions();

  }

  if (permission.receive !== "granted") {

    console.warn(
      "[ANDROID] Permiso denegado."
    );

    return;

  }

  PushNotifications.removeAllListeners();

  PushNotifications.addListener(
    "registration",
    async ({ value }) => {

      console.log(
        "[ANDROID] Token:",
        value
      );

      await registerAndroid({

        token: value,

        restaurantId,

        userId,

        platform: "android",

      });

    }
  );

  PushNotifications.addListener(
    "registrationError",
    (error) => {

      console.error(
        "[ANDROID]",
        error
      );

    }
  );

  await PushNotifications.register();

}