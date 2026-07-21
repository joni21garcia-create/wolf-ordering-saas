import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase config faltante: Revisa tus variables de entorno.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// URL base pública del storage de Supabase
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/restaurant-pwa`;

export async function getManagerPWASettings() {
  try {
    const { data, error } = await supabase
      .from("manager_pwa_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("Error al consultar manager_pwa_settings:", error);
      return null;
    }

    // ✨ HELPER REPARADO: Si la URL ya es completa (empieza con http), la usa directamente.
    // Si la base de datos devuelve solo la ruta relativa (ej: 'manager/icon-192.png' o 'icon-192.png'),
    // le concatena la URL de tu storage para que el navegador no dé 404.
    const cleanUrl = (url: any, defaultFilename?: string) => {
      if (typeof url !== 'string' || url.trim().length === 0) {
        return defaultFilename ? `${SUPABASE_STORAGE_URL}/manager/${defaultFilename}` : "";
      }
      
      if (url.startsWith('http')) {
        return url;
      }
      
      if (url.startsWith('manager/')) {
        return `${SUPABASE_STORAGE_URL}/${url}`;
      }
      
      return `${SUPABASE_STORAGE_URL}/manager/${url}`;
    };

    return {
      ...data,
      app_logo: cleanUrl(data.app_logo),
      icon_72_url: cleanUrl(data.icon_72_url, "icon-72.png"),
      icon_96_url: cleanUrl(data.icon_96_url, "icon-96.png"),
      icon_128_url: cleanUrl(data.icon_128_url, "icon-128.png"),
      icon_144_url: cleanUrl(data.icon_144_url, "icon-144.png"),
      icon_152_url: cleanUrl(data.icon_152_url, "icon-152.png"),
      icon_192_url: cleanUrl(data.icon_192_url, "icon-192.png"),
      icon_384_url: cleanUrl(data.icon_384_url, "icon-384.png"),
      icon_512_url: cleanUrl(data.icon_512_url, "icon-512.png"),
      maskable_icon_url: cleanUrl(data.maskable_icon_url, "maskable-icon.png"),
    };
  } catch (err) {
    console.error("Error inesperado en getManagerPWASettings:", err);
    return null;
  }
}


