import {
  RestaurantMetadataData,
} from "@/lib/restaurants/getRestaurantMetadata";

import {
  ManifestIcon,
  WolfManifest,
} from "./types";

export function buildRestaurantManifest(
  restaurant: RestaurantMetadataData
): WolfManifest {

  const icons: ManifestIcon[] = [];

  // 🛠️ BYPASS DE TIPADO: Accedemos de forma segura a cualquier propiedad fallback sin romper la interfaz estricta
  const rawRestaurant = restaurant as any;
  const fallbackIcon = 
    restaurant.pwaSettings?.icon_512_url || 
    rawRestaurant.pwa_icon_url || 
    rawRestaurant.logo_url || 
    null;

  // 🛠️ FUNCIÓN BLINDADA ORIGINAL: Corrige y previene URLs rotas del bucket de Supabase
  function addIcon(
    src: string | null,
    size: string,
    purpose?: "maskable"
  ) {
    let finalSrc = src || fallbackIcon;
    if (!finalSrc) return;

    // Si la URL contiene el prefijo viejo '/restaurants/', lo limpiamos para que apunte a la raíz del ID
    if (finalSrc.includes("/restaurant-pwa/restaurants/")) {
      finalSrc = finalSrc.replace("/restaurant-pwa/restaurants/", "/restaurant-pwa/");
    }

    // Evitar duplicar exactamente el mismo ícono con el mismo tamaño y propósito
    const isDuplicated = icons.some(icon => icon.sizes === size && icon.purpose === purpose);
    if (isDuplicated) return;

    icons.push({
      src: finalSrc,
      sizes: size,
      type: "image/png",
      purpose,
    });
  }

  // 1. Mapeo de tus íconos específicos desde base de datos
  addIcon(restaurant.pwaSettings?.icon_72_url ?? null, "72x72");
  addIcon(restaurant.pwaSettings?.icon_96_url ?? null, "96x96");
  addIcon(restaurant.pwaSettings?.icon_128_url ?? null, "128x128");
  addIcon(restaurant.pwaSettings?.icon_144_url ?? null, "144x144");
  addIcon(restaurant.pwaSettings?.icon_152_url ?? null, "152x152");
  addIcon(restaurant.pwaSettings?.icon_192_url ?? null, "192x192");
  addIcon(restaurant.pwaSettings?.icon_384_url ?? null, "384x384");
  addIcon(restaurant.pwaSettings?.icon_512_url ?? null, "512x512");
  
  // 2. Icono enmascarable para evitar marcos blancos en Android
  addIcon(
    restaurant.pwaSettings?.maskable_icon_url ?? null,
    "512x512",
    "maskable"
  );

  // Sincronizamos el start_url y el scope con la página real de pedidos (/demo/order)
  return {
    id: `/${restaurant.slug}/order`,

    name:
      restaurant.pwaSettings?.app_name ??
      restaurant.name,

    short_name:
      restaurant.pwaSettings?.short_name ??
      restaurant.name,

    description:
      restaurant.pwaSettings?.description ??
      restaurant.description ??
      "Aplicación Restaurante.",

    start_url: `/${restaurant.slug}/order`,

    scope: `/${restaurant.slug}/`,

    display:
      (restaurant.pwaSettings?.display ??
        "standalone") as WolfManifest["display"],

    orientation:
      (restaurant.pwaSettings?.orientation ??
        "portrait") as WolfManifest["orientation"],

    background_color:
      restaurant.pwaSettings?.background_color ??
      "#5f7510", // Fallback al color verde oliva de tu captura

    theme_color:
      restaurant.pwaSettings?.theme_color ??
      "#3b92a5", // Fallback al color azul personalizado de tu captura

    lang: "es",

    dir: "ltr",

    icons,
  };
}