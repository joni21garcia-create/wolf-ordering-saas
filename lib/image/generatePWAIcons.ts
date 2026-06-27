import sharp from "sharp";

import {
  PWA_ICON_SIZES,
} from "./iconSizes";

import {
  GenerateIconsResult,
  GeneratedIcon,
} from "./types";

export async function generatePWAIcons(
  originalImage: Buffer
): Promise<GenerateIconsResult> {

  const icons: GeneratedIcon[] = [];

  for (const icon of PWA_ICON_SIZES) {

 console.log("================================");
  console.log("GENERANDO ICONOS");
  console.log("Buffer:", Buffer.isBuffer(originalImage));
  console.log("Length:", originalImage.length);
  console.log(
    "Primeros bytes:",
    originalImage.subarray(0,16)
  );
  console.log("================================");



    const buffer =
      await sharp(originalImage)

        .resize(
          icon.size,
          icon.size,
          {
            fit: "cover",
          }
        )

        .png()

        .toBuffer();

    icons.push({
      name: icon.name,
      filename: icon.filename,
      size: icon.size,
      buffer,
    });

  }

  return {
    icons,
  };

}