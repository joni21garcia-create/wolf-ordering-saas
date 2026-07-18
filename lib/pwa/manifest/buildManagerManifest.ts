import { createClient } from "@supabase/supabase-js";
import { ManifestIcon } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// URL Base pública del bucket
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/restaurant-pwa`;

export async function buildManagerManifest() {
  let settings: any = null;

  try {
    const { data } = await supabase
      .from("manager_pwa_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    settings = data;
  } catch (err) {
    console.error("Error cargando manager_pwa_settings:", err);
  }

  // Lógica clara: si es una URL completa, la usa. 
  // Si no, construye la ruta obligatoria hacia la carpeta 'manager/'
  const getFinalUrl = (url: any, filename: string) => {
    if (typeof url === 'string' && url.startsWith('http')) {
      return url;
    }
    return `${SUPABASE_STORAGE_URL}/manager/${filename}`;
  };

  const icons: ManifestIcon[] = [];

  function addIcon(
    src: string | null | undefined,
    size: string,
    filename: string,
    purpose?: "maskable"
  ) {
    const finalSrc = getFinalUrl(src, filename);

    icons.push({
      src: finalSrc,
      sizes: size,
      type: "image/png",
      purpose: purpose || "any",
    });
  }

  // --- Construcción del Manifiesto ---
  addIcon(settings?.icon_72_url, "72x72", "icon-72.png");
  addIcon(settings?.icon_96_url, "96x96", "icon-96.png");
  addIcon(settings?.icon_128_url, "128x128", "icon-128.png");
  addIcon(settings?.icon_144_url, "144x144", "icon-144.png");
  addIcon(settings?.icon_152_url, "152x152", "icon-152.png");
  addIcon(settings?.icon_192_url, "192x192", "icon-192.png");
  addIcon(settings?.icon_384_url, "384x384", "icon-384.png");
  addIcon(settings?.icon_512_url, "512x512", "icon-512.png");
  addIcon(settings?.maskable_icon_url, "512x512", "maskable-icon.png", "maskable");

  return {
    id: "/",
    name: settings?.app_name || "Wolf Manager",
    short_name: settings?.short_name || "Manager",
    description: settings?.description || "Panel administrativo",
    start_url: "/login",
    scope: "/",
    display: "standalone",
    orientation: settings?.orientation || "portrait",
    background_color: settings?.background_color || "#050505",
    theme_color: settings?.theme_color || "#f97316",
    lang: "es",
    dir: "ltr",
    icons,
  };
}