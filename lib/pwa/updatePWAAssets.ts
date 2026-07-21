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

  // 1. Verificamos si ya existe una configuración previa para este restaurante
  const { data: existing, error: checkError } = await supabase
    .from("restaurant_pwa_settings")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (checkError) {
    console.error("Error comprobando existencia en restaurant_pwa_settings:", checkError);
    throw checkError;
  }

  let resultData = null;

  if (existing) {
    // 2A. Si ya existe, ejecutamos el UPDATE original
    console.log("DEBUG: El registro existe, ejecutando UPDATE...");
    const { data, error } = await supabase
      .from("restaurant_pwa_settings")
      .update(payload)
      .eq("restaurant_id", restaurantId)
      .select()
      .maybeSingle();

    if (error) throw error;
    resultData = data;
  } else {
    // 2B. Si NO existe (Restaurante Nuevo), ejecutamos un INSERT incorporando los campos requeridos NOT NULL
    console.log("DEBUG: El registro NO existe (Nuevo Restaurante), ejecutando INSERT...");
    const { data, error } = await supabase
      .from("restaurant_pwa_settings")
      .insert({
        ...payload,
        restaurant_id: restaurantId,
        app_name: "Mi Aplicación PWA", // Fallback obligatorio requerido por la BD
        short_name: "PWA",             // Fallback obligatorio requerido por la BD
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    resultData = data;
  }

  console.log("DEBUG: Operación en base de datos finalizada correctamente.");
  return resultData;
}


