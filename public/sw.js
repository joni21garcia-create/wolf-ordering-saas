/*
=========================================
 Wolf Ordering Service Worker
 Version 1.1 (Fixed Bugs)
=========================================
*/

const STATIC_CACHE = "wolf-static-v3";
const PAGES_CACHE = "wolf-pages-v1";

/*
=========================================
 INSTALL
=========================================
*/
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // Usamos un try/catch por si offline.html no existe aún, para que no rompa el SW
      try {
        await cache.addAll(["/offline.html"]);
      } catch (e) {
        console.warn("[SW] No se pudo cachear offline.html en el install", e);
      }
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
      const cacheNames = await caches.keys();
      const validCaches = [STATIC_CACHE, PAGES_CACHE];

      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!validCaches.includes(cacheName)) {
            console.log("[SW] Eliminando caché vieja:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
      console.log("[SW] Activo y reclamando clientes.");
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
  const url = new URL(request.url);

  // 1. Peticiones que NUNCA deben interceptarse
  if (
    request.method !== "GET" ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/reset-password") ||
    url.pathname.startsWith("/super-admin") ||
    url.pathname.startsWith("/admin") ||
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("localhost") // Evita romper hot-reload en desarrollo local
  ) {
    return;
  }

  const isStaticAsset =
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image";

  // 2. STALE-WHILE-REVALIDATE para recursos estáticos (.js, .css, imágenes locales)
  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const staticCache = await caches.open(STATIC_CACHE);
        const cachedResponse = await staticCache.match(request);

        const networkFetch = fetch(request)
          .then(async (response) => {
            // FIX: Validamos que la respuesta sea correcta antes de guardarla en caché
            if (response.ok && response.status === 200) {
              await staticCache.put(request, response.clone());
              console.log("[SW] Cache actualizado:", url.pathname);
            }
            return response;
          })
          .catch((err) => {
            console.error("[SW] Error en fetch de red para asset:", url.pathname, err);
            return cachedResponse;
          });

        if (cachedResponse) {
          console.log("[SW] Desde Cache:", url.pathname);
          return cachedResponse;
        }

        console.log("[SW] Desde Red:", url.pathname);
        return networkFetch;
      })()
    );
    return;
  }

  // 3. Estrategia de navegación para páginas (HTML)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        const pagesCache = await caches.open(PAGES_CACHE);
        try {
          const response = await fetch(request);
          if (response.ok && response.status === 200) {
            await pagesCache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          console.log("[SW] Red caída, buscando página en caché:", url.pathname);
          const cachedPage = await pagesCache.match(request);
          if (cachedPage) return cachedPage;

          // Si no hay página guardada, mostramos fallback offline
          const staticCache = await caches.open(STATIC_CACHE);
          const offlineFallback = await staticCache.match("/offline.html");
          if (offlineFallback) return offlineFallback;
          
          // Fallback de emergencia si ni el offline.html cargó
          return new Response("<h1>Estás desconectado</h1>", {
            headers: { "Content-Type": "text/html" }
          });
        }
      })()
    );
  }
});