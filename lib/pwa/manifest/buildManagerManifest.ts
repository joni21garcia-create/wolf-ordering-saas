import { createClient } from "@supabase/supabase-js";
import { ManifestIcon } from "./types";

// Inicializamos Supabase directamente aquí para no depender de imports externos
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// URL Base pública de tu bucket de Supabase
const SUPABASE_STORAGE_URL = `${supabaseUrl}/storage/v1/object/public/restaurant-pwa`;

const isValidUrl = (url: string | null | undefined): boolean => {
  return typeof url === 'string' && url.trim().length > 0 && url.startsWith('http');
};

export async function buildManagerManifest() {
  let settings: any = null;

  // 1. Buscamos directamente la configuración del manager
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

  // ✨ EL HELPER CORREGIDO: Si viene vacío, usa el fallback. Si no tiene http, le pega el bucket de Supabase.
  const cleanUrl = (url: any, defaultFilename: string) => {
    if (typeof url !== 'string' || url.trim().length === 0) {
      return `${SUPABASE_STORAGE_URL}/manager/${defaultFilename}`;
    }
    if (url.startsWith('http')) {
      return url;
    }
    if (url.startsWith('manager/')) {
      return `${SUPABASE_STORAGE_URL}/${url}`;
    }
    return `${SUPABASE_STORAGE_URL}/manager/${url}`;
  };

  const icons: ManifestIcon[] = [];

  function addIcon(
    src: string | null | undefined,
    size: string,
    defaultFilename: string,
    purpose?: "maskable"
  ) {
    const finalSrc = settings 
      ? cleanUrl(src, defaultFilename)
      : `${SUPABASE_STORAGE_URL}/manager/${defaultFilename}`;

    icons.push({
      src: finalSrc,
      sizes: size,
      type: "image/png",
      purpose: purpose || "any",
    });
  }

  const startUrl = "/login";
  const scopeUrl = "/";

  // --- Caso A: Si no hay conexión o no existe registro en la BD (Fallback seguro) ---
  if (!settings) {
    addIcon(null, "192x192", "icon-192.png");
    addIcon(null, "512x512", "icon-512.png");
    return {
      id: "/",
      name: "Wolf Manager",
      short_name: "Manager",
      description: "Panel administrativo",
      start_url: startUrl,
      scope: scopeUrl,
      display: "standalone", // 🚨 Forzado para instalabilidad
      orientation: "portrait",
      background_color: "#050505",
      theme_color: "#f97316",
      lang: "es",
      dir: "ltr",
      icons,
    };
  }

  // --- Caso B: Con tus datos reales del configurador ---
  addIcon(settings.icon_72_url, "72x72", "icon-72.png");
  addIcon(settings.icon_96_url, "96x96", "icon-96.png");
  addIcon(settings.icon_128_url, "128x128", "icon-128.png");
  addIcon(settings.icon_144_url, "144x144", "icon-144.png");
  addIcon(settings.icon_152_url, "152x152", "icon-152.png");
  addIcon(settings.icon_192_url, "192x192", "icon-192.png");
  addIcon(settings.icon_384_url, "384x384", "icon-384.png");
  addIcon(settings.icon_512_url, "512x512", "icon-512.png");
  addIcon(settings.maskable_icon_url, "512x512", "maskable-icon.png", "maskable");

  return {
    id: "/",
    name: settings.app_name || "Wolf Manager",
    short_name: settings.short_name || "Manager",
    description: settings.description || "Panel administrativo",
    start_url: startUrl,
    scope: scopeUrl,
    display: "standalone", // 🚨 Forzado para instalabilidad
    orientation: settings.orientation || "portrait",
    background_color: settings.background_color || "#050505",
    theme_color: settings.theme_color || "#f97316",
    lang: "es",
    dir: "ltr",
    icons,
  };
}