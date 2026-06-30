/* Wolf Ordering App Service Worker - Blindado y Segmentado */
const STATIC_CACHE = "wolf-static-v3";
const PAGES_CACHE = "wolf-pages-v1";
const MANAGER_CACHE = "wolf-manager-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.map((k) => ![STATIC_CACHE, PAGES_CACHE, MANAGER_CACHE].includes(k) && caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. BLINDAJE DE MANIFIESTOS (Punto crítico)
  // Ignoramos el SW para que la red gestione siempre el manifiesto fresco
  if (url.pathname.includes("/api/manifest/")) {
    return; 
  }

  // 2. BLINDAJE DEL MANAGER (Scope exclusivo)
  // Priorizamos la red (Network First) para el login/manager
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/manager")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(MANAGER_CACHE).then(cache => cache.put(event.request, copy));
          }
          return res;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          return cachedResponse || Response.error(); // Retorna error si no hay caché
        })
    );
    return; 
  }

  // 3. LÓGICA DE RESTAURANTE (App Global)
  const isStatic = ["style", "script", "font", "image"].includes(event.request.destination);

  if (isStatic) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetched = fetch(event.request).then(res => {
          if (res.ok) cache.put(event.request, res.clone());
          return res;
        });
        return cached || fetched;
      })
    );
  } else if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.open(PAGES_CACHE).then(c => c.match(event.request)))
    );
  }
});