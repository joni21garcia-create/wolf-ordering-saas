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

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fegilyorwocgcbwomyb2.supabase.co"; 
  
  const rawLogo = restaurant.pwaSettings?.app_logo || restaurant.pwaSettings?.icon_512_url || null;
  let fallbackIconUrl = rawLogo;

  if (fallbackIconUrl && !fallbackIconUrl.startsWith("http")) {
    fallbackIconUrl = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/${fallbackIconUrl.replace(/^\//, "")}`;
  }

  // 🛠️ FUNCIÓN PROCESADORA MEJORADA: Detecta el tipo MIME real de la imagen
  function addIcon(
    src: string | null,
    size: string,
    purpose?: "maskable"
  ) {
    let finalSrc = src || fallbackIconUrl;
    if (!finalSrc) return;

    if (!finalSrc.startsWith("http") && !finalSrc.startsWith("/")) {
      finalSrc = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/${finalSrc}`;
    }

    if (finalSrc.includes("/restaurant-pwa/restaurants/")) {
      finalSrc = finalSrc.replace("/restaurant-pwa/restaurants/", "/restaurant-pwa/");
    }

// 🌟 DETECCIÓN DINÁMICA DE TIPO: Evita que Chrome rechace el ícono si no es PNG original
    let imageType = "image/png";
    const lowerSrc = finalSrc.toLowerCase();
    if (lowerSrc.endsWith(".jpg") || lowerSrc.endsWith(".jpeg")) {
      imageType = "image/jpeg";
    } else if (lowerSrc.endsWith(".webp")) {
      imageType = "image/webp";
    } else if (lowerSrc.endsWith(".svg")) {
      imageType = "image/svg+xml";
    }

    icons.push({
      src: finalSrc,
      sizes: size,
      type: imageType as any, // 🛠️ FIX TYPE-CHECK: Forzamos la asignación dinámica
      purpose,
    });
  }

  addIcon(restaurant.pwaSettings?.icon_72_url ?? null, "72x72");
  addIcon(restaurant.pwaSettings?.icon_96_url ?? null, "96x96");
  addIcon(restaurant.pwaSettings?.icon_128_url ?? null, "128x128");
  addIcon(restaurant.pwaSettings?.icon_144_url ?? null, "144x144");
  addIcon(restaurant.pwaSettings?.icon_152_url ?? null, "152x152");
  addIcon(restaurant.pwaSettings?.icon_192_url ?? null, "192x192");
  addIcon(restaurant.pwaSettings?.icon_384_url ?? null, "384x384");
  addIcon(restaurant.pwaSettings?.icon_512_url ?? null, "512x512");
  
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

    start_url: `/${restaurant.slug}`,

    scope: `/${restaurant.slug}/`,

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

    icons,
  };
}