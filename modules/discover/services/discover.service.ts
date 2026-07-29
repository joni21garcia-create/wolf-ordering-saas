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
      estimated_max_time
    `)
    .eq("active", true)
    .eq("suspended", false)
    .order("name");

  if (error) {
    console.error("[Discover]", error);
    return [];
  }

  return (data ?? []).map((restaurant) => ({
    ...restaurant,

    // Temporal hasta que exista la categoría real
    category: null,

    latitude: null,
    longitude: null,
  }));
}