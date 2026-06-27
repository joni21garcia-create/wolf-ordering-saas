export async function registerSW(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration =
      await navigator.serviceWorker.register(path);

    console.log(
      "[SW] Registrado:",
      registration.scope
    );

    registration.addEventListener(
      "updatefound",
      () => {
        console.log(
          "[SW] Nueva versión encontrada."
        );
      }
    );

  } catch (error) {
    console.error(
      "[SW] Error registrando Service Worker",
      error
    );
  }
}