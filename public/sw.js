/* Wolf Ordering App Service Worker - V5 Profesional */
const STATIC_CACHE = "wolf-static-v5";
const PAGES_CACHE = "wolf-pages-v2";
const MANAGER_CACHE = "wolf-manager-v2";

const CACHE_NAMES = [STATIC_CACHE, PAGES_CACHE, MANAGER_CACHE];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (!CACHE_NAMES.includes(k)) {
            return caches.delete(k);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. IGNORAR APIS DINÁMICAS (Supabase, Auth, etc)
  if (url.origin.includes("supabase.co") || url.pathname.includes("/api/")) {
    return;
  }

  // 2. LÓGICA DE MANAGER / LOGIN (Network First)
  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/manager")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            // CLONAR ANTES DE CONSUMIR
            const resToCache = res.clone();
            caches.open(MANAGER_CACHE).then((cache) => cache.put(event.request, resToCache));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 3. LÓGICA DE ESTATICOS (Cache First)
  if (["style", "script", "font", "image"].includes(event.request.destination)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const resToCache = res.clone(); // CLONADO PREVENTIVO
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, resToCache));
          }
          return res;
        });
      })
    );
    return;
  }

  // 4. LÓGICA DE NAVEGACIÓN (Network First con Fallback a Cache)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resToCache = res.clone(); // CLONADO PREVENTIVO
          caches.open(PAGES_CACHE).then((c) => c.put(event.request, resToCache));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});