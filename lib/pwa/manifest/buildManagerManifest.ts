import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";
import { ManifestIcon } from "./types";

const isValidUrl = (url: string | null | undefined): boolean => {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
};

export async function buildManagerManifest() {
  const settings = await getManagerPWASettings();
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://feffanubyjbviwsvqbrc.supabase.co";
  // NOTA: Asegúrate que el bucket aquí coincida con el que definiste en IMAGE_BUCKETS.pwa
  const DEFAULT_ICON = `${SUPABASE_URL}/storage/v1/object/public/restaurant-pwa/manager/default-manager-logo.png`;

  const icons: ManifestIcon[] = [];

  function addIcon(
    src: string | null | undefined,
    size: string,
    purpose?: "maskable"
  ) {
    let finalSrc = isValidUrl(src) 
      ? src! 
      : (isValidUrl(settings?.app_logo) ? settings!.app_logo! : DEFAULT_ICON);
    
    // Si la URL tiene el timestamp ?t=..., lo mantenemos porque es necesario para refrescar
    icons.push({
      src: finalSrc,
      sizes: size,
      type: "image/png",
      purpose: purpose || undefined, // Evitamos pasar "undefined" explícito si no hay purpose
    });
  }

  // --- Si NO hay settings (Primer despliegue o error) ---
  if (!settings) {
    addIcon(null, "192x192");
    addIcon(null, "512x512");
    return {
      id: "/manager",
      name: "Wolf Manager",
      short_name: "Manager",
      description: "Panel administrativo",
      start_url: "/manager",
      scope: "/manager/",
      display: "standalone",
      orientation: "portrait",
      background_color: "#050505",
      theme_color: "#f97316",
      lang: "es",
      dir: "ltr",
      icons,
    };
  }

  // --- Agregar iconos desde la BD ---
  addIcon(settings.icon_72_url, "72x72");
  addIcon(settings.icon_96_url, "96x96");
  addIcon(settings.icon_128_url, "128x128");
  addIcon(settings.icon_144_url, "144x144");
  addIcon(settings.icon_152_url, "152x152");
  addIcon(settings.icon_192_url, "192x192");
  addIcon(settings.icon_384_url, "384x384");
  addIcon(settings.icon_512_url, "512x512");
  addIcon(settings.maskable_icon_url, "512x512", "maskable");

  return {
    id: "/manager",
    name: settings.app_name || "Wolf Manager",
    short_name: settings.short_name || "Manager",
    description: settings.description || "Panel administrativo",
    start_url: "/manager",
    scope: "/manager/",
    display: settings.display || "standalone",
    orientation: settings.orientation || "portrait",
    background_color: settings.background_color || "#050505",
    theme_color: settings.theme_color || "#f97316",
    lang: "es",
    dir: "ltr",
    icons,
  };
}