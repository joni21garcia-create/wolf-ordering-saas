/**
 * Registrar el Service Worker con control estricto de scope
 * y manejo de ciclo de vida para evitar conflictos con el manifiesto.
 */
export async function registerSW(path: string) {
  // 1. Verificaciones de entorno: Solo correr en el navegador
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    // 2. Registro explícito con scope definido
    // Forzamos scope: "/" para asegurar que el SW gestione toda la app
    const registration = await navigator.serviceWorker.register(path, {
      scope: "/", 
    });

    console.log("[SW] Registrado con éxito en el scope:", registration.scope);

    // 3. Manejo del ciclo de vida y actualizaciones
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        console.log("[SW] Estado del worker:", newWorker.state);

        // Si el worker llega a 'installed' y ya existía un controlador,
        // notificamos al usuario para que recargue y vea la nueva versión.
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            console.log("[SW] Nueva versión detectada, esperando activación...");
            window.dispatchEvent(new CustomEvent("wolf-update-available"));
          } else {
            console.log("[SW] Instalación inicial completada.");
          }
        }
      });
    });

    // 4. Verificación de activación para evitar bloqueos
    // Esto asegura que el SW tome control inmediatamente
    if (registration.waiting) {
        window.dispatchEvent(new CustomEvent("wolf-update-available"));
    }

  } catch (error) {
    console.error("[SW] Error crítico al registrar el Service Worker:", error);
  }
}