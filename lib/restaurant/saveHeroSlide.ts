"use server"; // 👈 ¡AGREGA ESTO AQUÍ ARRIBA!

import { createClient } from "@supabase/supabase-js";

// Inicializamos el cliente de Supabase desde el Servidor
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SaveHeroSlideParams {
  id?: string;
  restaurantId: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  sortOrder?: number;
  active?: boolean;
}

export async function saveHeroSlide({
  id,
  restaurantId,
  imageUrl,
  title = "",
  subtitle = "",
  buttonText = "",
  buttonUrl = "",
  sortOrder = 0,
  active = true,
}: SaveHeroSlideParams) {
  

  const payload = {
    restaurant_id: restaurantId,
    image_url: imageUrl,
    title,
    subtitle,
    button_text: buttonText,
    button_url: buttonUrl,
    sort_order: sortOrder,
    active,
  };

  let resultData = null;

  if (id) {
    const { data, error } = await supabase
      .from("restaurant_hero_slides")
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error ejecutando UPDATE en restaurant_hero_slides:", error);
      throw error;
    }
    resultData = data;
  } else {
    const { data, error } = await supabase
      .from("restaurant_hero_slides")
      .insert(payload)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error ejecutando INSERT en restaurant_hero_slides:", error);
      throw error;
    }
    resultData = data;
  }

  return resultData;
}


