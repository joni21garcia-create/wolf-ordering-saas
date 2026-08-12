import { supabase } from "@/lib/supabase/client";
import type { Restaurant } from "@/modules/discover/types/restaurant";

export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select(`
      id,
      slug,
      name,
      logo_url,
      banner_url,
      address,
      latitude,
      longitude,
      category,
      accepting_orders,
      discover_visible,
      prep_time_min,
      prep_time_max,
      featured_type,
      featured_order,
      schedule_settings:schedule_settings!schedule_settings_restaurant_id_fkey (
        sunday_open,
        sunday_close,
        monday_open,
        monday_close,
        tuesday_open,
        tuesday_close,
        wednesday_open,
        wednesday_close,
        thursday_open,
        thursday_close,
        friday_open,
        friday_close,
        saturday_open,
        saturday_close
      )
    `)
    .eq("active", true)
    .eq("suspended", false)
    .eq("discover_visible", true);

  if (error) {
    console.error("[DISCOVER ERROR]", error);
    throw error;
  }

  const restaurants: Restaurant[] = (data ?? []).map(
    (restaurant) => ({
      id: restaurant.id,
      slug: restaurant.slug,
      name: restaurant.name,
      logo_url: restaurant.logo_url,
      banner_url: restaurant.banner_url,
      address: restaurant.address,

      // Coordenadas reales de Supabase.
      // No convertirlas a string ni recalcularlas aquí.
      latitude:
        typeof restaurant.latitude === "number"
          ? restaurant.latitude
          : restaurant.latitude !== null &&
              restaurant.latitude !== undefined
            ? Number(restaurant.latitude)
            : null,

      longitude:
        typeof restaurant.longitude === "number"
          ? restaurant.longitude
          : restaurant.longitude !== null &&
              restaurant.longitude !== undefined
            ? Number(restaurant.longitude)
            : null,

      category: restaurant.category,

      accepting_orders:
        restaurant.accepting_orders,

      discover_visible:
        restaurant.discover_visible,

      schedule_settings:
        Array.isArray(restaurant.schedule_settings)
          ? restaurant.schedule_settings[0] ?? null
          : restaurant.schedule_settings ?? null,

      estimated_min_time:
        restaurant.prep_time_min,

      estimated_max_time:
        restaurant.prep_time_max,

      featured_type:
        restaurant.featured_type,

      featured_order:
        restaurant.featured_order,
    }),
  );

  /*
  ==========================================================
  ORDEN BASE DISCOVER
  ==========================================================

  La prioridad comercial de destacados se conserva aquí.

  El ranking por cercanía se aplica posteriormente en
  discoverQuery(), cuando existe la ubicación del usuario.
  */

  restaurants.sort((a, b) => {
    const aFeatured =
      a.featured_type &&
      a.featured_type !== "none";

    const bFeatured =
      b.featured_type &&
      b.featured_type !== "none";

    if (aFeatured && !bFeatured) return -1;
    if (!aFeatured && bFeatured) return 1;

    if (aFeatured && bFeatured) {
      const orderA =
        a.featured_order ?? 9999;

      const orderB =
        b.featured_order ?? 9999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }
    }

    return a.name.localeCompare(b.name, "es");
  });

  return restaurants;
}