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
    console.log("🔥🔥🔥 REGISTER WEB V2 EJECUTÁNDOSE 🔥🔥🔥");

  /*
  ==========================================================
  SOPORTE
  ==========================================================
  */

  if (!("serviceWorker" in navigator)) {

    console.warn(
      "[WEB PUSH] Service Worker no soportado."
    );

    return null;

  }

  if (!("PushManager" in window)) {

    console.warn(
      "[WEB PUSH] PushManager no soportado."
    );

    return null;

  }

  /*
  ==========================================================
  PERMISOS
  ==========================================================
  */

  let permission = Notification.permission;

console.log(
  "[WEB PUSH] Permiso antes de solicitar:",
  permission
);

if (permission === "default") {

  console.log(
    "[WEB PUSH] Solicitando permiso..."
  );

  permission =
    await Notification.requestPermission();

}

console.log(
  "[WEB PUSH] Permiso después de solicitar:",
  permission
);

if (permission !== "granted") {

  console.warn(
    "[WEB PUSH] Permiso no concedido:",
    permission
  );

  return null;

}
  /*
  ==========================================================
  SERVICE WORKER
  ==========================================================
  */

  console.log(
    "[WEB PUSH] Esperando Service Worker..."
  );

  const registration =
    await navigator.serviceWorker.ready;

  console.log(
    "[WEB PUSH] Service Worker listo."
  );

  /*
  ==========================================================
  SUSCRIPCIÓN
  ==========================================================
  */

  let subscription =
    await registration.pushManager.getSubscription();

  console.log(
    "[WEB PUSH] Suscripción existente:",
    !!subscription
  );

  if (!subscription) {

    console.log(
      "[WEB PUSH] Creando nueva suscripción..."
    );

    subscription =
      await registration.pushManager.subscribe({

        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            process.env
              .NEXT_PUBLIC_VAPID_PUBLIC_KEY!
          ),

      });

    console.log(
      "[WEB PUSH] Nueva suscripción creada."
    );

  }

  /*
  ==========================================================
  API
  ==========================================================
  */

  console.log(
    "[WEB PUSH] Registrando en servidor..."
  );

  const response =
    await fetch("/api/push/subscribe", {

      method: "POST",

      headers: {

        "Content-Type":
          "application/json",

      },

      credentials: "include",

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
    "[WEB PUSH] Respuesta:",
    result
  );

  if (result.subscription_id) {

    localStorage.setItem(

      "wolf_push_subscription_id",

      String(result.subscription_id)

    );

    console.log(

      "[WEB PUSH] subscription_id:",

      result.subscription_id

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