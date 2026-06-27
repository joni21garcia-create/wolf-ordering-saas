/*
=========================================
 Wolf Ordering Service Worker
 Version 1
=========================================
*/

/*
=========================================
CACHE NAMES
=========================================
*/

const STATIC_CACHE = "wolf-static-v1";

/*
En fases posteriores agregaremos:

const RESTAURANT_CACHE = "wolf-restaurant-v1";

const MANAGER_CACHE = "wolf-manager-v1";

const OFFLINE_CACHE = "wolf-offline-v1";
*/

/*
=========================================
 INSTALL
=========================================
*/

self.addEventListener("install", () => {

  console.log("[SW] Instalando...");

  self.skipWaiting();

});

/*
=========================================
 ACTIVATE
=========================================
*/

self.addEventListener("activate", (event) => {

  console.log("[SW] Activando...");

  event.waitUntil(

    (async () => {

      const cacheNames =
        await caches.keys();

      const validCaches = [
        STATIC_CACHE,
      ];

      await Promise.all(

        cacheNames.map((cacheName) => {

          if (!validCaches.includes(cacheName)) {

            console.log(
              "[SW] Eliminando caché:",
              cacheName
            );

            return caches.delete(cacheName);

          }

        })

      );

      await self.clients.claim();

      console.log("[SW] Activo.");

    })()

  );

});

/*
=========================================
 FETCH
=========================================
*/

self.addEventListener("fetch", (event) => {

  const request = event.request;

  const url =
    new URL(request.url);

  /*
  =========================================
  PETICIONES QUE NUNCA DEBEN CACHEARSE
  =========================================
  */

  if (

    request.method !== "GET" ||

    url.pathname.startsWith("/api") ||

    url.pathname.startsWith("/login") ||

    url.pathname.startsWith("/auth") ||

    url.pathname.startsWith("/reset-password") ||

    url.pathname.startsWith("/super-admin") ||

    url.pathname.startsWith("/admin") ||

    url.hostname.includes("supabase.co")

  ) {

    return;

  }

  /*
  =========================================
  STATIC ASSETS
  =========================================
  */

  const isStaticAsset =

    request.destination === "style" ||

    request.destination === "script" ||

    request.destination === "font" ||

    request.destination === "image";

  /*
  =========================================
  CACHE FIRST
  Recursos estáticos
  =========================================
  */

  if (isStaticAsset) {

    event.respondWith(

      (async () => {

        const cache =
          await caches.open(
            STATIC_CACHE
          );

        const cachedResponse =
          await cache.match(request);

        if (cachedResponse) {

          console.log(
            "[SW] Cache:",
            request.url
          );

          return cachedResponse;

        }

        console.log(
          "[SW] Network:",
          request.url
        );

        const networkResponse =
          await fetch(request);

        await cache.put(
          request,
          networkResponse.clone()
        );

        return networkResponse;

      })()

    );

    return;

  }

  /*
  =========================================
  Las demás peticiones continúan
  normalmente hacia Internet.
  =========================================
  */

});