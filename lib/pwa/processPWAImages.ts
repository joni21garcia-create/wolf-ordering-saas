import {
  generatePWAIcons,
} from "@/lib/image/generatePWAIcons";

import {
  uploadGeneratedIcons,
  UploadedIcon,
} from "./uploadGeneratedIcons";

export interface ProcessPWAImagesResult {
  icons: UploadedIcon[];
  settings: any;
}

interface ProcessPWAImagesParams {
  folder: string;
  originalImage: Buffer;
  appLogo: string;
  updateAssets: (
    icons: UploadedIcon[],
    appLogo: string
  ) => Promise<any>;
}

export async function processPWAImages({
  folder,
  originalImage,
  appLogo,
  updateAssets,
}: ProcessPWAImagesParams): Promise<ProcessPWAImagesResult> {


  // 1. Validación de seguridad del Buffer recibido
  if (!originalImage || !Buffer.isBuffer(originalImage) || originalImage.length === 0) {
    console.error("[PWA Process] Error: El buffer de la imagen original está vacío o es inválido.");
    throw new Error("La imagen original proporcionada no es válida para procesar los iconos de la PWA.");
  }

  try {
    // 2. Generación de las variantes de tamaño usando Sharp
    const generated = await generatePWAIcons(originalImage);
    
    if (!generated?.icons || generated.icons.length === 0) {
      throw new Error("La generación con Sharp no devolvió ningún icono procesado.");
    }

    // 3. Subida paralela y optimizada de las imágenes al Storage de Supabase
    const uploaded = await uploadGeneratedIcons({
      folder,
      icons: generated.icons,
    });

    if (!uploaded || uploaded.length === 0) {
      throw new Error("La subida de archivos al storage de Supabase no devolvió referencias válidas.");
    }

    // 4. Actualización de las referencias en la Base de Datos (Supabase DB)
    const settings = await updateAssets(
      uploaded,
      appLogo
    );

    return {
      icons: uploaded,
      settings,
    };

  } catch (error: any) {
    // Captura cualquier fallo en cualquiera de las fases para evitar bloqueos silenciosos
    console.error("[PWA Process] ❌ Error crítico durante el flujo processPWAImages:", error);
    throw new Error(`Fallo en el pipeline de procesamiento PWA: ${error.message || error}`);
  }
}


