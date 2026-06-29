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

    window.dispatchEvent(
      new CustomEvent("wolf-update-available")
    );


    const newWorker =
      registration.installing;

    if (!newWorker) {
      return;
    }

    newWorker.addEventListener(
      "statechange",
      () => {

        console.log(
          "[SW] Estado:",
          newWorker.state
        );

        if (
          newWorker.state ===
          "installed"
        ) {

          if (
            navigator.serviceWorker.controller
          ) {

            console.log(
              "[SW] Nueva versión lista."
            );

          } else {

            console.log(
              "[SW] Instalación inicial completada."
            );

          }

        }

      }
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