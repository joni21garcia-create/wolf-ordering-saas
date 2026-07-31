import { GeneratedIcon } from "@/lib/image/types";

import { uploadFile } from "@/lib/storage/upload";
import { getPublicUrl } from "@/lib/storage/signed-url";

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

  //----------------------------------
  // Normalizar carpeta
  //----------------------------------

  const cleanFolder =
    folder
      .replace(/^\/+|\/+$/g, "")
      .trim();

  //----------------------------------
  // Subir iconos
  //----------------------------------

  for (const icon of icons) {

    const path =
      `${cleanFolder}/${icon.filename}`;

    const key =
      `restaurant-pwa/${path}`;

    await uploadFile({
      key,
      body: icon.buffer,
      contentType: "image/png",
    });

    uploaded.push({
      name: icon.name,
      filename: icon.filename,
      url: getPublicUrl(key),
    });
  }

  return uploaded;
}