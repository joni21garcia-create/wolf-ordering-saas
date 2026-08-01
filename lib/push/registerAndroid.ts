/*
==========================================================

Wolf Ordering Push V2

Registro Android (Capacitor + Firebase)

==========================================================
*/

import { RegisterAndroidInput } from "./types";

export async function registerAndroid({
  token,
  platform = "android",
}: RegisterAndroidInput): Promise<boolean> {

  if (!token) {

    console.error(
      "[ANDROID PUSH] Token vacío."
    );

    return false;

  }

  try {

    console.log(
      "[ANDROID PUSH] Registrando dispositivo..."
    );

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

          platform,

        }),

      });

    const result =
      await response.json();

    if (!response.ok) {

      console.error(
        "[ANDROID PUSH]",
        result
      );

      return false;

    }

    console.log(
      "[ANDROID PUSH] Dispositivo registrado."
    );

    console.log(result);

    return true;

  } catch (error) {

    console.error(
      "[ANDROID PUSH]",
      error
    );

    return false;

  }

}