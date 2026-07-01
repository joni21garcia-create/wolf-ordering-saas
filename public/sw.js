/* ==========================================
 Wolf Ordering Service Worker V8
========================================== */

const STATIC_CACHE = "wolf-static-v6";
const PAGES_CACHE = "wolf-pages-v3";

const CACHE_NAMES = [
  STATIC_CACHE,
  PAGES_CACHE,
];

/* INSTALL */

self.addEventListener("install", () => {
  self.skipWaiting();
});

/* ACTIVATE */

self.addEventListener("activate", (event) => {

  event.waitUntil(

    (async () => {

      const keys = await caches.keys();

      await Promise.all(

        keys.map((key) => {

          if (!CACHE_NAMES.includes(key)) {
            return caches.delete(key);
          }

        })

      );

      await self.clients.claim();

    })()

  );

});

/* ==========================================
 PUSH
========================================== */

self.addEventListener("push", (event) => {
  const data = event.data
    ? event.data.json()
    : {
        title: "Wolf Ordering",
        body: "Nuevo pedido recibido",
        url: "/manager",
      };

  const options = {
    body: data.body,

    data: {
      url: data.url ?? "/manager",
    },

    vibrate: [300, 100, 300],

    requireInteraction: true,

    actions: [
      {
        action: "open",
        title: "Ver pedido",
      },
    ],
  };

  // Solo agrega iconos si vienen en el payload
  if (data.icon) {
    options.icon = data.icon;
  }

  if (data.badge) {
    options.badge = data.badge;
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title,
      options
    )
  );
});

/* ==========================================
 CLICK
========================================== */

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();

    event.waitUntil(

      clients.matchAll({
        type: "window",
      }).then((clientList) => {

        for (const client of clientList) {

          if ("focus" in client) {

            client.navigate(
              event.notification.data.url
            );

            return client.focus();

          }

        }

        return clients.openWindow(
          event.notification.data.url
        );

      })

    );

  }
);

/* ==========================================
 FETCH
========================================== */

self.addEventListener("fetch", (event) => {

  const request = event.request;

  const url = new URL(request.url);

  if (

    request.method !== "GET" ||

    url.pathname.startsWith("/api") ||

    url.hostname.includes("supabase.co")

  ) {

    return;

  }

  if (

    request.destination === "style" ||

    request.destination === "script" ||

    request.destination === "font" ||

    request.destination === "image"

  ) {

    event.respondWith(

      (async () => {

        const cache =
          await caches.open(
            STATIC_CACHE
          );

        const cached =
          await cache.match(request);

        if (cached) {
          return cached;
        }

        const response =
          await fetch(request);

        cache.put(
          request,
          response.clone()
        );

        return response;

      })()

    );

    return;

  }

  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request).catch(
        async () => {

          const cache =
            await caches.open(
              PAGES_CACHE
            );

          return cache.match(request);

        }
      )

    );

  }

});