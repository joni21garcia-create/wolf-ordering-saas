/* Wolf Ordering App Service Worker - V6 con Push Notifications */
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

/* --- LÓGICA DE NOTIFICACIONES PUSH --- */

self.addEventListener("push", (event) => {
  let data = { title: "Wolf Ordering", body: "Tienes una nueva notificación", url: "/" };
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png", // Asegúrate de tener este icono
    badge: "/icons/icon-72x72.png",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

/* --- LÓGICA DE FETCH (Mantenida intacta) --- */

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.origin.includes("supabase.co") || url.pathname.includes("/api/")) {
    return;
  }

  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/manager")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const resToCache = res.clone();
            caches.open(MANAGER_CACHE).then((cache) => cache.put(event.request, resToCache));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  if (["style", "script", "font", "image"].includes(event.request.destination)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request).then((res) => {
          if (res && res.status === 200) {
            const resToCache = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, resToCache));
          }
          return res;
        });
      })
    );
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resToCache = res.clone();
          caches.open(PAGES_CACHE).then((c) => c.put(event.request, resToCache));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});