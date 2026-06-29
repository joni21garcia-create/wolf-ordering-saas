import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface RestaurantMetadataData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;

  pwaSettings: {
    app_name: string;
    short_name: string;
    description: string | null;
    theme_color: string | null;
    background_color: string | null;
    display: string | null;
    orientation: string | null;
    app_logo: string | null;
    favicon_url: string | null;
    icon_72_url: string | null;
    icon_96_url: string | null;
    icon_128_url: string | null;
    icon_144_url: string | null;
    icon_152_url: string | null;
    icon_192_url: string | null;
    icon_384_url: string | null;
    icon_512_url: string | null;
    apple_icon_url: string | null;
    maskable_icon_url: string | null;
  } | null;
}

export async function getRestaurantMetadata(
  slug: string
): Promise<RestaurantMetadataData | null> {
  const supabase = await createSupabaseServerClient();

  // Consulta relacional directa para obtener el restaurante y su configuración PWA
  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .select(`
      id,
      slug,
      name,
      description,
      meta_title,
      meta_description,
      og_image_url,
      pwaSettings:restaurant_pwa_settings (
        app_name,
        short_name,
        description,
        theme_color,
        background_color,
        display,
        orientation,
        app_logo,
        favicon_url,
        icon_72_url,
        icon_96_url,
        icon_128_url,
        icon_144_url,
        icon_152_url,
        icon_192_url,
        icon_384_url,
        icon_512_url,
        apple_icon_url,
        maskable_icon_url
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error al obtener metadata:", error.message);
    return null;
  }

  if (!restaurant) {
    return null;
  }

  // Manejo de la relación (pwaSettings puede ser un objeto o un array de un solo elemento)
  const pwaSettings = Array.isArray(restaurant.pwaSettings)
    ? restaurant.pwaSettings[0]
    : restaurant.pwaSettings;

  return {
    id: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,
    description: restaurant.description,
    meta_title: restaurant.meta_title,
    meta_description: restaurant.meta_description,
    og_image_url: restaurant.og_image_url,
    pwaSettings: pwaSettings || null,
  };
}