import { supabase } from "@/lib/supabase/client";

import type { Restaurant } from "../types/restaurant";

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
      accepting_orders,
      estimated_min_time,
      estimated_max_time,

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
    .order("name", { ascending: true });

  if (error) {
    console.error(
      "[Discover] Error obteniendo restaurantes:",
      error
    );

    throw error;
  }

  return (data ?? []).map((restaurant) => ({
    id: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,

    logo_url: restaurant.logo_url,
    banner_url: restaurant.banner_url,

    address: restaurant.address,

    accepting_orders:
      restaurant.accepting_orders,

    schedule_settings:
      restaurant.schedule_settings?.[0] ?? null,

    estimated_min_time:
      restaurant.estimated_min_time,

    estimated_max_time:
      restaurant.estimated_max_time,

    // Temporales hasta implementar estas funcionalidades
    category: null,
    latitude: null,
    longitude: null,
  }));
}