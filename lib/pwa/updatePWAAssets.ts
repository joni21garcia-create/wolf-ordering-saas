import { createClient } from "@supabase/supabase-js";
import { UploadedIcon } from "./uploadGeneratedIcons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdatePWAAssetsParams {
  restaurantId: string;
  appLogo: string;
  icons: UploadedIcon[];
}

export async function updatePWAAssets({
  restaurantId,
  appLogo,
  icons,
}: UpdatePWAAssetsParams) {
  
  console.log("DEBUG: Iniciando updatePWAAssets para restaurante:", restaurantId);
  console.log("DEBUG: Iconos recibidos para procesar:", icons.length);

  // Limpiamos la URL para quitar posibles parámetros de query innecesarios
  const getUrl = (filename: string) => {
    const icon = icons.find((i) => i.filename === filename);
    const url = icon?.url ?? null;
    
    console.log(`DEBUG: Obteniendo URL para ${filename} -> ${url ? "OK" : "NULL"}`);
    
    if (!url) return null;
    
    // Eliminamos todo después del signo de interrogación si existiera, 
    // para asegurar que guardamos la URL pública pura.
    return url.split("?")[0];
  };

  const payload = {
    app_logo: appLogo,
    favicon_url: getUrl("favicon.png"),
    icon_72_url: getUrl("icon-72.png"),
    icon_96_url: getUrl("icon-96.png"),
    icon_128_url: getUrl("icon-128.png"),
    icon_144_url: getUrl("icon-144.png"),
    icon_152_url: getUrl("icon-152.png"),
    icon_192_url: getUrl("icon-192.png"),
    icon_384_url: getUrl("icon-384.png"),
    icon_512_url: getUrl("icon-512.png"),
    apple_icon_url: getUrl("apple-touch-icon.png"),
    maskable_icon_url: getUrl("maskable-icon.png"),
    updated_at: new Date().toISOString(),
  };

  console.log("DEBUG: Payload enviado a Supabase:", payload);

  const { data, error } = await supabase
    .from("restaurant_pwa_settings")
    .update(payload)
    .eq("restaurant_id", restaurantId)
    .select()
    .single();

  if (error) {
    console.error("Error actualizando assets PWA:", error);
    throw error;
  }

  console.log("DEBUG: Actualización en base de datos finalizada correctamente.");
  return data;
}