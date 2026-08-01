/*
==========================================================

Wolf Ordering Push V2

Registro Web Push (PWA)

==========================================================
*/

import { RegisterWebInput } from "./types";

export async function registerWeb({
  restaurantId,
  userId,
}: RegisterWebInput): Promise<number | null> {

  /*
  ==========================================================
  SOPORTE
  ==========================================================
  */

  if (!("serviceWorker" in navigator))
    return null;

  if (!("PushManager" in window))
    return null;

  /*
  ==========================================================
  PERMISOS
  ==========================================================
  */

  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {

    console.warn(
      "[WEB PUSH] Permiso denegado."
    );

    return null;

  }

  /*
  ==========================================================
  SERVICE WORKER
  ==========================================================
  */

  const registration =
    await navigator.serviceWorker.ready;

  /*
  ==========================================================
  SUSCRIPCIÓN
  ==========================================================
  */

  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {

    subscription =
      await registration.pushManager.subscribe({

        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            process.env
              .NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),

      });

  }

  /*
  ==========================================================
  API
  ==========================================================
  */

  const response =
    await fetch("/api/push/subscribe", {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

      },

      body: JSON.stringify({

        restaurant_id:
          restaurantId,

        user_id:
          userId ?? null,

        subscription,

        user_agent:
          navigator.userAgent,

      }),

    });

  if (!response.ok) {

    console.error(
      "[WEB PUSH] Error registrando."
    );

    return null;

  }

  const result =
    await response.json();

  console.log(
    "[WEB PUSH]",
    result
  );

  if (result.subscription_id) {
  localStorage.setItem(
    "wolf_push_subscription_id",
    String(result.subscription_id)
  );
}

  return result.subscription_id ?? null;

}

/*
==========================================================

UTILIDAD

==========================================================
*/

function urlBase64ToUint8Array(
  base64String: string
) {

  const padding =
    "=".repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (base64String + padding)

      .replace(/-/g, "+")

      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  return Uint8Array.from(

    [...rawData].map(

      (char) =>
        char.charCodeAt(0)

    )

  );

}