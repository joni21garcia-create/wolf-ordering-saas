/* Wolf Ordering App Service Worker - Optimizado para Actualización Forzosa */
const STATIC_CACHE = "wolf-static-v4"; // Aumentado para forzar limpieza
const PAGES_CACHE = "wolf-pages-v2";
const MANAGER_CACHE = "wolf-manager-v2";

self.addEventListener("install", (event) => {
  // skipWaiting asegura que el nuevo SW tome el control inmediatamente
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((k) => {
          if (![STATIC_CACHE, PAGES_CACHE, MANAGER_CACHE].includes(k)) {
            return caches.delete(k);
          }
        })
      )
    ).then(() => self.clients.claim()) // Toma el control de las páginas abiertas
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 1. IGNORAR CACHÉ PARA SUPABASE Y APIS DINÁMICAS
  // Si tu app llama a Supabase, el SW debe dejarlas pasar a la red siempre.
  if (url.origin.includes("supabase.co") || url.pathname.includes("/api/")) {
    return; // El navegador va directo a la red (sin intervención del SW)
  }

  // 2. BLINDAJE DEL MANAGER (Network First)
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
          return await caches.match(event.request);
        })
    );
    return;
  }

  // 3. LÓGICA DE NAVEGACIÓN Y ESTATICOS (Network First para Navegación)
  const isStatic = ["style", "script", "font", "image"].includes(event.request.destination);

  if (isStatic) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          if (res.ok) {
            caches.open(STATIC_CACHE).then(cache => cache.put(event.request, res.clone()));
          }
          return res;
        });
      })
    );
  } else if (event.request.mode === "navigate") {
    // Para las páginas, intentamos siempre la red primero (Network First)
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES_CACHE).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});