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

  // 🛠️ FALLBACK ABSOLUTO: Si los íconos individuales vienen vacíos, usamos el logo principal de la PWA (app_logo)
  // Obtenemos la URL de Supabase desde la variable de entorno o directamente de la URL de producción
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fegilyorwocgcbwomyb2.supabase.co"; 
  
  const rawLogo = restaurant.pwaSettings?.app_logo || restaurant.pwaSettings?.icon_512_url || null;
  let fallbackIconUrl = rawLogo;

  // Si el logo de Supabase es solo un path relativo, lo transformamos en URL pública absoluta
  if (fallbackIconUrl && !fallbackIconUrl.startsWith("http")) {
    fallbackIconUrl = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/${fallbackIconUrl.replace(/^\//, "")}`;
  }

  // 🛠️ FUNCIÓN PROCESADORA: Valida y asegura URLs absolutas para la PWA
  function addIcon(
    src: string | null,
    size: string,
    purpose?: "maskable"
  ) {
    let finalSrc = src || fallbackIconUrl;
    if (!finalSrc) return;

    // Si viene de Supabase como path relativo, lo convertimos en absoluto
    if (!finalSrc.startsWith("http") && !finalSrc.startsWith("/")) {
      finalSrc = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/${finalSrc}`;
    }

    // Limpieza de subcarpetas viejas duplicadas en el storage
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

  // Mapeo exacto basado en tu interfaz RestaurantMetadataData
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

  // Tu retorno original e intacto para mantener la perfecta instalación de la PWA
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