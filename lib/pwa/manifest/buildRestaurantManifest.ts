import { RestaurantMetadataData } from "@/lib/restaurants/getRestaurantMetadata";
import { ManifestIcon, WolfManifest } from "./types";

export function buildRestaurantManifest(
  restaurant: RestaurantMetadataData
): WolfManifest {
  const icons: ManifestIcon[] = [];
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://feffanubyjbviwsvqbrc.supabase.co";
  
  // URL por defecto si nada más existe
  const DEFAULT_ICON = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/default-wolf-logo.png`;

  function addIcon(
    src: string | null | undefined,
    size: string,
    purpose?: "maskable"
  ) {
    // Usamos la URL tal cual viene de la base de datos o el fallback
    const finalSrc = src || DEFAULT_ICON;

    // Si es un archivo PNG, definimos el tipo, si no, por defecto image/png
    const imageType = "image/png";

    icons.push({
      src: finalSrc,
      sizes: size,
      type: imageType,
      purpose,
    });
  }

  // Agregar iconos desde la BD sin transformaciones destructivas
  addIcon(restaurant.pwaSettings?.icon_72_url, "72x72");
  addIcon(restaurant.pwaSettings?.icon_96_url, "96x96");
  addIcon(restaurant.pwaSettings?.icon_128_url, "128x128");
  addIcon(restaurant.pwaSettings?.icon_144_url, "144x144");
  addIcon(restaurant.pwaSettings?.icon_152_url, "152x152");
  addIcon(restaurant.pwaSettings?.icon_192_url, "192x192");
  addIcon(restaurant.pwaSettings?.icon_384_url, "384x384");
  addIcon(restaurant.pwaSettings?.icon_512_url, "512x512");
  
  addIcon(
    restaurant.pwaSettings?.maskable_icon_url,
    "512x512",
    "maskable"
  );

  return {
    id: `/${restaurant.slug}`,
    name: restaurant.pwaSettings?.app_name ?? restaurant.name,
    short_name: restaurant.pwaSettings?.short_name ?? restaurant.name,
    description: restaurant.pwaSettings?.description ?? restaurant.description ?? "",
    start_url: `/${restaurant.slug}`,
    scope: `/${restaurant.slug}/`,
    display: (restaurant.pwaSettings?.display ?? "standalone") as WolfManifest["display"],
    orientation: (restaurant.pwaSettings?.orientation ?? "portrait") as WolfManifest["orientation"],
    background_color: restaurant.pwaSettings?.background_color ?? "#111827",
    theme_color: restaurant.pwaSettings?.theme_color ?? "#f97316",
    icons,
  };
}