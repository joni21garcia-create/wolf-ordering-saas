/* Wolf Ordering App Service Worker - V7 Profesional con Push Force */
const STATIC_CACHE = "wolf-static-v5";
const PAGES_CACHE = "wolf-pages-v2";
const MANAGER_CACHE = "wolf-manager-v2";

const CACHE_NAMES = [STATIC_CACHE, PAGES_CACHE, MANAGER_CACHE];

self.addEventListener("install", (event) => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (!CACHE_NAMES.includes(k) ? caches.delete(k) : null)))
    ).then(() => self.clients.claim())
  );
});

/* --- LÓGICA DE NOTIFICACIONES PUSH --- */
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Wolf Ordering", body: "Nuevo pedido recibido", url: "/admin/orders" };

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: { url: data.url || "/admin/orders" },
    vibrate: [500, 200, 500, 200, 500], // Patrón de vibración más largo
    requireInteraction: true,
    silent: false, // OBLIGATORIO: Asegura que suene
    actions: [{ action: 'open', title: 'Ver Pedido' }]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});

/* --- LÓGICA DE FETCH --- */
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin.includes("supabase.co") || url.pathname.includes("/api/")) return;

  if (url.pathname.startsWith("/login") || url.pathname.startsWith("/manager")) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  if (["style", "script", "font", "image"].includes(event.request.destination)) {
    event.respondWith(caches.match(event.request).then((res) => res || fetch(event.request)));
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});