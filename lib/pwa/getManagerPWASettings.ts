import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Validación crítica para evitar errores de ejecución en el servidor
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase config faltante: Revisa tus variables de entorno.");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Helper para limpiar URLs: solo devuelve la URL si es válida
    const cleanUrl = (url: any) => 
      (typeof url === 'string' && url.startsWith('http')) ? url : "";

    return {
      ...data,
      app_logo: cleanUrl(data.app_logo),
      icon_72_url: cleanUrl(data.icon_72_url),
      icon_96_url: cleanUrl(data.icon_96_url),
      icon_128_url: cleanUrl(data.icon_128_url),
      icon_144_url: cleanUrl(data.icon_144_url),
      icon_152_url: cleanUrl(data.icon_152_url),
      icon_192_url: cleanUrl(data.icon_192_url),
      icon_384_url: cleanUrl(data.icon_384_url),
      icon_512_url: cleanUrl(data.icon_512_url),
      maskable_icon_url: cleanUrl(data.maskable_icon_url),
    };
  } catch (err) {
    console.error("Error inesperado en getManagerPWASettings:", err);
    return null;
  }
}