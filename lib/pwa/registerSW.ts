/**
 * Wolf Ordering
 * Service Worker Registration V2
 *
 * Compatible con Wolf Service Worker V11 Enterprise
 */

export async function registerSW(path: string) {
  if (typeof window === "undefined") return;

  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register(path, {
      scope: "/",
    });

    console.log(
      "[SW] Registrado correctamente:",
      registration.scope
    );

    /* ======================================================
       NUEVA VERSION DETECTADA
    ====================================================== */

    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;

      if (!installingWorker) return;

      console.log("[SW] Descargando nueva versión...");

      installingWorker.addEventListener("statechange", () => {
        console.log(
          "[SW] Estado:",
          installingWorker.state
        );

        if (installingWorker.state !== "installed") {
          return;
        }

        /*
         Primera instalación
        */

        if (!navigator.serviceWorker.controller) {
          console.log(
            "[SW] Instalación inicial completada."
          );

          return;
        }

        /*
         Nueva versión disponible
        */

        console.log(
          "[SW] Nueva versión detectada."
        );

        registration.waiting?.postMessage({
          type: "SKIP_WAITING",
        });

        window.dispatchEvent(
          new CustomEvent("wolf-update-available")
        );
      });
    });

    /* ======================================================
       YA EXISTE UNA VERSION ESPERANDO
    ====================================================== */

    if (registration.waiting) {
      console.log(
        "[SW] Hay una actualización pendiente."
      );

      registration.waiting.postMessage({
        type: "SKIP_WAITING",
      });

      window.dispatchEvent(
        new CustomEvent("wolf-update-available")
      );
    }

    /* ======================================================
       NUEVO SW TOMO EL CONTROL
    ====================================================== */

    let refreshing = false;

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => {
        if (refreshing) return;

        refreshing = true;

        console.log(
          "[SW] Nuevo Service Worker activo."
        );

        window.location.reload();
      }
    );

    /* ======================================================
       MENSAJES DEL SERVICE WORKER
    ====================================================== */

    navigator.serviceWorker.addEventListener(
      "message",
      (event) => {
        if (!event.data) return;

        switch (event.data.type) {
          case "SW_READY":

            console.log(
              "[SW] Ready",
              event.data.version
            );

            break;

          case "SW_ACTIVATED":

            console.log(
              "[SW] Activado",
              event.data.version
            );

            break;

          case "VERSION":

            console.log(
              "[SW] Version:",
              event.data.version
            );

            break;
        }
      }
    );

    /* ======================================================
       BUSCAR ACTUALIZACIONES
    ====================================================== */

    try {
      registration.update();
    } catch {}

    /*
      Buscar nuevas versiones cada minuto
    */

    setInterval(() => {
      registration.update();
    }, 60000);

  } catch (error) {
    console.error(
      "[SW] Error registrando Service Worker:",
      error
    );
  }
}


