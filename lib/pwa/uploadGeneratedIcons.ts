import { createClient } from "@supabase/supabase-js";
import { GeneratedIcon } from "@/lib/image/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UploadedIcon {
  name: string;
  filename: string;
  url: string;
}

interface UploadGeneratedIconsParams {
  folder: string; // Ejemplo: "restaurants/aa5dc78e-..." o "manager"
  icons: GeneratedIcon[];
}

export async function uploadGeneratedIcons({
  folder,
  icons,
}: UploadGeneratedIconsParams): Promise<UploadedIcon[]> {
  
  const uploaded: UploadedIcon[] = [];

  // Normalizamos el folder: quitamos espacios y barras redundantes al inicio/final
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "").trim();

  console.log(`[PWA Upload] Iniciando subida de ${icons.length} iconos a la carpeta: "${cleanFolder}"`);

  for (const icon of icons) {
    // Ruta limpia y estandarizada dentro del bucket
    const path = `${cleanFolder}/${icon.filename}`;

    // 🛡️ SUBIDA BLINDADA: 
    // Forzamos "contentType: image/png" y configuramos "cacheControl" agresivo (1 año).
    // Esto garantiza que el validador de PWAs de Chrome nunca reciba un archivo corrupto "octet-stream"
    // y descargue las imágenes de manera ultra rápida.
    const { error } = await supabase.storage
      .from("restaurant-pwa")
      .upload(path, icon.buffer, {
        contentType: "image/png",
        upsert: true,
        cacheControl: "public, max-age=31536000, must-revalidate", // Cacheo óptimo recomendado por Google
      });

    if (error) {
      console.error(`[PWA Upload] Error crítico subiendo icono PWA a ${path}:`, error);
      throw error;
    }

    // Obtenemos la URL pública
    const { data } = supabase.storage
      .from("restaurant-pwa")
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      console.error(`[PWA Upload] Error: No se pudo resolver la URL pública de Supabase para ${path}`);
      throw new Error(`Error al resolver URL pública del icono: ${icon.filename}`);
    }

    // URL pública limpia y directa (aprovecha la caché real del navegador y Supabase)
    const cleanUrl = data.publicUrl;

    uploaded.push({
      name: icon.name,
      filename: icon.filename,
      url: cleanUrl, 
    });
  }

  console.log("[PWA Upload] Subida de iconos PWA completada exitosamente.");

  return uploaded;
}