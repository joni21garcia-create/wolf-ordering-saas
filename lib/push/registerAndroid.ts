/*
==========================================================

Wolf Ordering Push V2

Registro Android (Capacitor + Firebase)

==========================================================
*/

import { RegisterAndroidInput } from "./types";

export async function registerAndroid({
  token,
  restaurantId,
  userId,
  platform,
}: RegisterAndroidInput): Promise<boolean> {

  if (!token) {

    console.error(
      "[ANDROID PUSH] Token vacío."
    );

    return false;

  }

  try {

    const response =
      await fetch("/api/push/register-device", {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

        },

        credentials: "include",

        body: JSON.stringify({

          token,

          restaurant_id:
            restaurantId ?? null,

          user_id:
            userId ?? null,

          platform,

        }),

      });

    if (!response.ok) {

      console.error(
        "[ANDROID PUSH] Error registrando dispositivo."
      );

      return false;

    }

    const result =
      await response.json();

    console.log(
      "[ANDROID PUSH]",
      result
    );

    return true;

  } catch (error) {

    console.error(
      "[ANDROID PUSH]",
      error
    );

    return false;

  }

}