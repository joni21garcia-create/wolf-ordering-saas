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
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");

  console.log(`Subiendo ${icons.length} iconos a la carpeta: ${cleanFolder}`);

  for (const icon of icons) {
    // Ruta limpia y estandarizada dentro del bucket
    const path = `${cleanFolder}/${icon.filename}`;

    const { error } = await supabase.storage
      .from("restaurant-pwa")
      .upload(path, icon.buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error(`Error crítico subiendo icono PWA a ${path}:`, error);
      throw error;
    }

    // Obtenemos la URL pública
    const { data } = supabase.storage
      .from("restaurant-pwa")
      .getPublicUrl(path);

    // 🛠️ SOLUCIÓN PARA IMÁGENES ROTAS: Cache-Busting
    // Agregamos un timestamp único al final de la URL.
    // Esto obliga al navegador y a los Service Workers a ignorar
    // las versiones antiguas o rotas guardadas en caché, forzando
    // la descarga de la nueva versión del icono.
    const uniqueUrl = `${data.publicUrl}?t=${Date.now()}`;

    uploaded.push({
      name: icon.name,
      filename: icon.filename,
      url: uniqueUrl, // Guardamos la URL blindada contra caché
    });
  }

  console.log("Subida de iconos PWA completada exitosamente.");

  return uploaded;
}