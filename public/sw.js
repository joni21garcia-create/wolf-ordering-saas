/* ============================================================
   Wolf Ordering Service Worker V11.4 Enterprise - BLINDADO
   ------------------------------------------------------------
   Solución definitiva: Interceptación y guardado de assets 
   CORS/Opacos desde el bucket de Supabase para instalabilidad.
============================================================ */

const VERSION = "1787952051572";

const CACHE = {
    STATIC: `wolf-static-${VERSION}`,
    PAGES: `wolf-pages-${VERSION}`,
    IMAGES: `wolf-images-${VERSION}`,
    OFFLINE: `wolf-offline-${VERSION}`
};

const VALID_CACHES = Object.values(CACHE);
const MAX_IMAGE_CACHE = 80;
const OFFLINE_PAGE = "/offline.html";

const NEVER_CACHE = [
    "/service-worker.js",
    "/favicon.ico"
];

/* ============================================================
   HELPERS / VALIDACIONES
============================================================ */
function isHTML(request) { 
    return request.mode === "navigate"; 
}

function isImage(request, url) { 
    return (
        request.destination === "image" || 
        url.pathname.startsWith("/_next/image") ||
        url.pathname.includes("/storage/v1/object/public/") // Forzar que los iconos de Supabase se traten como imágenes
    ); 
}

function isStatic(request) {
    return ["script", "style", "font"].includes(request.destination);
}

function shouldIgnore(request, url) {
    if (request.method !== "GET") return true;
    if (url.pathname.startsWith("/api")) return true;
    if (url.pathname.startsWith("/super-admin")) return true;
    if (url.pathname.startsWith("/_next/webpack-hmr")) return true;
    if (NEVER_CACHE.includes(url.pathname)) return true;

    // Supabase: Ignorar la base de datos (rest) y la autenticación (auth),
    // pero NO ignorar las imágenes del bucket (storage) para que el SW las procese y permita la instalación
    if (url.hostname.includes("supabase.co")) {
        if (url.pathname.startsWith("/rest/v1") || url.pathname.startsWith("/auth/v1")) {
            return true; 
        }
    }

    return false;
}

/* ============================================================
   LIFECYCLE (INSTALL / ACTIVATE)
============================================================ */
self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const offlineCache = await caches.open(CACHE.OFFLINE);
            try {
                await offlineCache.add(new Request(OFFLINE_PAGE, { cache: "reload" }));
            } catch (error) {
                console.warn("[SW] Advertencia: offline.html no disponible temporalmente.");
            }
            await self.skipWaiting();
        })()
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            const cacheKeys = await caches.keys();
            await Promise.all(
                cacheKeys.map((key) => {
                    if (!VALID_CACHES.includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
            await self.clients.claim();

            const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
            for (const client of clients) {
                client.postMessage({ type: "SW_ACTIVATED", version: VERSION });
            }
        })()
    );
});

/* ============================================================
   MESSAGE HANDLER UNIFICADO
============================================================ */
self.addEventListener("message", (event) => {
    if (!event.data) return;

    switch (event.data.type) {
        case "SKIP_WAITING":
            self.skipWaiting();
            break;

        case "CLEAR_CACHE":
            event.waitUntil(
                caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
            );
            break;

        case "GET_VERSION":
            event.source?.postMessage({ type: "VERSION", version: VERSION });
            break;

        case "CLIENT_READY":
            event.source?.postMessage({
                type: "SW_READY",
                version: VERSION,
                caches: VALID_CACHES
            });
            break;
    }
});

/* ============================================================
   STRATEGIES (FETCH)
============================================================ */
self.addEventListener("fetch", (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (shouldIgnore(request, url)) return;

// Estrategia HTML
if (isHTML(request)) {
    event.respondWith(networkFirst(request));
    return;
}

    // Estrategia JS/CSS/Fonts
    if (isStatic(request)) {
        event.respondWith(staleWhileRevalidate(request, CACHE.STATIC));
        return;
    }

    // Estrategia Imágenes (Incluye iconos guardados en Supabase Storage)
    if (isImage(request, url)) {
        event.respondWith(cacheFirst(request, CACHE.IMAGES));
        return;
    }
});

async function networkFirst(request) {
    const cache = await caches.open(CACHE.PAGES);
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch {
        const cached = await cache.match(request);
        if (cached) return cached;
        
        const offline = await caches.match(OFFLINE_PAGE);
        if (offline) return offline;
        
        return new Response("Contenido no disponible sin conexión", {
            status: 503,
            headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const networkFetch = fetch(request)
        .then(async (response) => {
            if (response.ok) {
                await cache.put(request, response.clone());
            }
            return response;
        })
        .catch(() => null);

    return cached || networkFetch || new Response("Recurso no disponible", { status: 404 });
}

// ✨ ESTRATEGIA OPTIMIZADA CON SOPORTE PARA CORS Y RESPUESTAS OPACAS DE SUPABASE
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
        const isSupabaseAsset = request.url.includes("supabase.co");
        
        // Si el recurso es de Supabase, forzamos un fetch con CORS configurado
        const fetchRequest = isSupabaseAsset 
            ? new Request(request.url, { mode: 'cors', credentials: 'omit' })
            : request;

        const response = await fetch(fetchRequest);
        
        // Almacenamos la respuesta si es OK (status 200) o si es opaca de Supabase (status 0)
        if (response && (response.ok || (isSupabaseAsset && response.status === 0))) {
            await cache.put(request, response.clone());
            await trimImageCache();
        }
        return response;
    } catch (e) {
        // Fallback seguro a un icono local del proyecto si se pierde la red por completo
        const fallback = await caches.match("/icons/icon-192.png");
        if (fallback) return fallback;

        return new Response("Imagen no disponible", { status: 404 });
    }
}

async function trimImageCache() {
    const cache = await caches.open(CACHE.IMAGES);
    const keys = await cache.keys();
    if (keys.length <= MAX_IMAGE_CACHE) return;

    const extra = keys.length - MAX_IMAGE_CACHE;
    for (let i = 0; i < extra; i++) {
        await cache.delete(keys[i]);
    }
}

/* ============================================================
   PUSH NOTIFICATIONS & INTERACTIONS
============================================================ */

self.addEventListener("push", (event) => {

    console.log("[SW] Push recibido");

    let payload = {
        title: "Wolf Ordering",
        body: "Nuevo pedido recibido",
        url: "/",
        icon: "/wolfweb.png",
        badge: "/wolfweb.png",
        image: undefined,
        tag: "orders"
    };

    try {

        if (event.data) {

            const data = event.data.json();

            console.log("[SW] Payload:", data);

            payload = {

                ...payload,

                ...data,

                title:
                    typeof data.title === "string" &&
                    data.title.trim() !== ""
                        ? data.title
                        : payload.title,

                body:
                    typeof data.body === "string"
                        ? data.body
                        : payload.body,

                url:
                    typeof data.url === "string" &&
                    data.url.trim() !== ""
                        ? data.url
                        : "/",

                icon:
                    typeof data.icon === "string" &&
                    data.icon.trim() !== ""
                        ? data.icon
                        : "/icons/icon-192.png",

                badge:
                    typeof data.badge === "string" &&
                    data.badge.trim() !== ""
                        ? data.badge
                        : "/icons/badge.png",

                image:
                    typeof data.image === "string" &&
                    data.image.trim() !== ""
                        ? data.image
                        : undefined,

                tag:
                    typeof data.tag === "string" &&
                    data.tag.trim() !== ""
                        ? data.tag
                        : "orders",

            };

        }

    } catch (error) {

        console.error(
            "[SW] Payload inválido",
            error
        );

    }

    console.log(
        "[SW] Mostrando notificación:",
        payload
    );

    event.waitUntil(

        self.registration.showNotification(

            payload.title,

            {

                body: payload.body,

                icon: payload.icon,

                badge: payload.badge,

                image: payload.image,

                tag: payload.tag,

                renotify: true,

                requireInteraction: true,

                vibrate: [300, 100, 300],

                data: {

                    url: payload.url,

                    timestamp: Date.now(),

                },

            }

        )

    );

});
self.addEventListener("notificationclick", (event) => {

    event.notification.close();

    const targetUrl =
        typeof event.notification.data?.url === "string" &&
        event.notification.data.url.trim() !== ""
            ? event.notification.data.url
            : "/";

    console.log(
        "[SW] Click en notificación:",
        targetUrl
    );

    event.waitUntil(

        (async () => {

            const windowClients =
                await clients.matchAll({

                    type: "window",

                    includeUncontrolled: true,

                });

            for (const client of windowClients) {

                try {

                    const current =
                        new URL(client.url);

                    console.log(
                        "[SW] Ventana abierta:",
                        current.pathname
                    );

                    if (

                        current.pathname === targetUrl ||

                        current.pathname.startsWith(targetUrl) ||

                        client.url.includes(targetUrl)

                    ) {

                        console.log(
                            "[SW] Reutilizando ventana."
                        );

                        await client.focus();

                        return;

                    }

                } catch (error) {

                    console.error(
                        "[SW]",
                        error
                    );

                }

            }

            console.log(
                "[SW] Abriendo nueva ventana:",
                targetUrl
            );

            await clients.openWindow(targetUrl);

        })()

    );

});