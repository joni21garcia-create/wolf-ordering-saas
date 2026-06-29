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

  // 🛠️ FUNCIÓN BLINDADA: Corrige y previene URLs rotas del bucket de Supabase
  function addIcon(
    src: string | null,
    size: string,
    purpose?: "maskable"
  ) {
    if (!src) return;

    let finalSrc = src;

    // Si la URL contiene el prefijo viejo '/restaurants/', lo limpiamos para que apunte a la raíz del ID
    if (finalSrc.includes("/restaurant-pwa/restaurants/")) {
      finalSrc = finalSrc.replace("/restaurant-pwa/restaurants/", "/restaurant-pwa/");
    }

    icons.push({
      src: finalSrc,
      sizes: size,
      type: "image/png",
      purpose,
    });
  }

  addIcon(
    restaurant.pwaSettings?.icon_72_url ?? null,
    "72x72"
  );

  addIcon(
    restaurant.pwaSettings?.icon_96_url ?? null,
    "96x96"
  );

  addIcon(
    restaurant.pwaSettings?.icon_128_url ?? null,
    "128x128"
  );

  addIcon(
    restaurant.pwaSettings?.icon_144_url ?? null,
    "144x144"
  );

  addIcon(
    restaurant.pwaSettings?.icon_152_url ?? null,
    "152x152"
  );

  addIcon(
    restaurant.pwaSettings?.icon_192_url ?? null,
    "192x192"
  );

  addIcon(
    restaurant.pwaSettings?.icon_384_url ?? null,
    "384x384"
  );

  addIcon(
    restaurant.pwaSettings?.icon_512_url ?? null,
    "512x512"
  );

  addIcon(
    restaurant.pwaSettings?.maskable_icon_url ?? null,
    "512x512",
    "maskable"
  );

  return {

    id: `/${restaurant.slug}`,

    name:
      restaurant.pwaSettings?.app_name ??
      restaurant.name,

    short_name:
      restaurant.pwaSettings?.short_name ??
      restaurant.name,

    description:
      restaurant.pwaSettings?.description ??
      restaurant.description ??
      "",

    start_url:
      `/${restaurant.slug}`,

    scope:
      `/${restaurant.slug}/`,

    display:
      (restaurant.pwaSettings?.display ??
        "standalone") as WolfManifest["display"],

    orientation:
      (restaurant.pwaSettings?.orientation ??
        "portrait") as WolfManifest["orientation"],

    background_color:
      restaurant.pwaSettings?.background_color ??
      "#111827",

    theme_color:
      restaurant.pwaSettings?.theme_color ??
      "#f97316",

    lang: "es",

    dir: "ltr",

    icons,

  };

}