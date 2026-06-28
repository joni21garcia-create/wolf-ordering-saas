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

const STATIC_CACHE = "wolf-static-v2";

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

self.addEventListener("install", (event) => {

  console.log("[SW] Instalando...");

  event.waitUntil(

    (async () => {

      const cache =
        await caches.open(
          STATIC_CACHE
        );

      await cache.addAll([
        "/offline.html",
      ]);

      self.skipWaiting();

    })()

  );

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
STALE WHILE REVALIDATE
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

      const networkFetch =
        fetch(request)
          .then(async (response) => {

            if (response.ok) {

              await cache.put(
                request,
                response.clone()
              );

              console.log(
                "[SW] Actualizado:",
                request.url
              );

            }

            return response;

          })
          .catch(() => cachedResponse);

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

      return networkFetch;

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

if (request.mode === "navigate") {

  event.respondWith(

    (async () => {

      try {

        return await fetch(request);

      } catch {

        const cache =
          await caches.open(
            STATIC_CACHE
          );

return await cache.match(
  "/offline.html"
);

      }

    })()

  );

}

});