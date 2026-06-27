import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getPWASettings(
  restaurantId: string
) {
  if (!restaurantId) {
    return null;
  }

  const { data, error } = await supabase
    .from("restaurant_pwa_settings")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (error) {
    console.error(
      "Error cargando configuración PWA:",
      error
    );

    return null;
  }

  return data;
}