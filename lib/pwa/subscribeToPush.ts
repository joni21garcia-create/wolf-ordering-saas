export async function subscribeToPush(
  restaurantId: string,
  userId: string
) {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  if (!("PushManager" in window)) {
    return false;
  }

  const registration =
    await navigator.serviceWorker.ready;

  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    console.warn(
      "[PUSH] Permiso denegado."
    );

    return false;
  }

  const publicKey =
    process.env
      .NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  // ✅ Reutiliza la suscripción si ya existe
  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {

    subscription =
      await registration.pushManager.subscribe({

        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            publicKey
          ),

      });

  }

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
          userId,

        subscription,

        user_agent:
          navigator.userAgent,

      }),

    });

  if (!response.ok) {

    console.error(
      "[PUSH] Error registrando dispositivo."
    );

    return false;

  }

  console.log(
    "[PUSH] Dispositivo registrado."
  );

  return true;
}

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