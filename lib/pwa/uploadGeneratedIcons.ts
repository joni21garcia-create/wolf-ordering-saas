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
  folder: string; // Ejemplo: "restaurants/aa5dc78e-..."
  icons: GeneratedIcon[];
}

export async function uploadGeneratedIcons({
  folder,
  icons,
}: UploadGeneratedIconsParams): Promise<UploadedIcon[]> {
  
  const uploaded: UploadedIcon[] = [];

  // Normalizamos el folder: quitamos espacios y barras redundantes al inicio/final
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");

  for (const icon of icons) {
    // Ruta limpia y estandarizada
    const path = `${cleanFolder}/${icon.filename}`;

    const { error } = await supabase.storage
      .from("restaurant-pwa")
      .upload(path, icon.buffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      console.error(`Error subiendo ${path}:`, error);
      throw error;
    }

    const { data } = supabase.storage
      .from("restaurant-pwa")
      .getPublicUrl(path);

    uploaded.push({
      name: icon.name,
      filename: icon.filename,
      url: data.publicUrl,
    });
  }

  return uploaded;
}