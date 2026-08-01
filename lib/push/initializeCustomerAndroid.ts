/*
==========================================================

Wolf Ordering Push V2

Inicialización Android Cliente

==========================================================
*/

import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";

import { Preferences } from "@capacitor/preferences";

import { registerCustomerAndroid } from "./registerCustomerAndroid";

interface InitializeCustomerAndroidInput {
  restaurantId: string;
}

export async function initializeCustomerAndroid({
  restaurantId,
}: InitializeCustomerAndroidInput) {

  if (!Capacitor.isNativePlatform()) {
    return;
  }

  await PushNotifications.requestPermissions();

  await PushNotifications.register();

  PushNotifications.removeAllListeners();

  PushNotifications.addListener(
    "registration",
    async (token: Token) => {

      console.log(
        "[CUSTOMER ANDROID] Token:",
        token.value
      );

      const result =
        await registerCustomerAndroid({

          restaurantId,

          token: token.value,

        });

      if (!result.success) {

        console.error(
          "[CUSTOMER ANDROID] No fue posible registrar el dispositivo."
        );

        return;

      }

      if (!result.subscriptionId) {
        return;
      }

      await Preferences.set({

        key: "push_subscription_id",

        value: result.subscriptionId.toString(),

      });

      console.log(
        "[CUSTOMER ANDROID] Subscription ID:",
        result.subscriptionId
      );

    }
  );

  PushNotifications.addListener(
    "registrationError",
    (error) => {

      console.error(
        "[CUSTOMER ANDROID]",
        error
      );

    }
  );

}