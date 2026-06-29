import sharp from "sharp";
import { PWA_ICON_SIZES } from "./iconSizes";
import { GenerateIconsResult, GeneratedIcon } from "./types";

export async function generatePWAIcons(
  originalImage: Buffer
): Promise<GenerateIconsResult> {
  
  // Procesamos todos los iconos en paralelo para mayor velocidad
  const iconPromises = PWA_ICON_SIZES.map(async (icon) => {
    try {
      const buffer = await sharp(originalImage)
        .resize(icon.size, icon.size, {
          fit: "cover",
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Asegura transparencia
        })
        .png({
          compressionLevel: 9,
          palette: true // Optimiza el tamaño del archivo PNG
        })
        .toBuffer();

      return {
        name: icon.name,
        filename: icon.filename,
        size: icon.size,
        buffer,
      };
    } catch (error) {
      console.error(`Error generando icono ${icon.filename}:`, error);
      throw error;
    }
  });

  const icons = await Promise.all(iconPromises);

  return { icons };
}