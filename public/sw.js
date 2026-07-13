/* ==========================================
 Wolf Ordering Service Worker V9
========================================== */

const SW_VERSION = "10";

const STATIC_CACHE = `wolf-static-${SW_VERSION}`;
const PAGES_CACHE = `wolf-pages-${SW_VERSION}`;

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

  let data = {
    title: "Wolf Ordering",
    body: "Nuevo pedido recibido",
    url: "/manager",
  };

  try {

    if (event.data) {

      data = event.data.json();

    }

  } catch (err) {

    console.error(
      "Push inválido",
      err
    );

  }

  const options = {

    body: data.body,

    icon:
      data.icon ??
      "/icons/icon-192.png",

    badge:
      data.badge ??
      "/icons/badge.png",

    data: {
      url: data.url ?? "/manager",
    },

    tag: "orders",

    renotify: true,

    requireInteraction: true,

    vibrate: [300,100,300],

  };

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

    const url =
      event.notification.data?.url || "/";

    event.waitUntil(

      clients.matchAll({
        type:"window",
        includeUncontrolled:true,
      })

      .then((clientList)=>{

        for(const client of clientList){

          if(client.url.includes(url)){

            return client.focus();

          }

        }

        return clients.openWindow(url);

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

    try {

      const response =
        await fetch(request);

if (response.ok) {

   cache.put(
      request,
      response.clone()
   );

}

      return response;

    } catch (error) {

      console.log(
        "Error cargando recurso:",
        request.url
      );

      const cached =
        await cache.match(request);

      if (cached) {
        return cached;
      }

      throw error;

    }

  })()

);

    return;

  }

 if (request.mode === "navigate") {
  return;
}

});