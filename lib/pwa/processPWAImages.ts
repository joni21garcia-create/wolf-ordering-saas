import {
  generatePWAIcons,
} from "@/lib/image/generatePWAIcons";

import {
  uploadGeneratedIcons,
  UploadedIcon,
} from "./uploadGeneratedIcons";

import {
  updatePWAAssets,
} from "./updatePWAAssets";

export interface ProcessPWAImagesResult {
  icons: UploadedIcon[];
  settings: any;
}

export async function processPWAImages(
  restaurantId: string,
  originalImage: Buffer,
  appLogo: string
): Promise<ProcessPWAImagesResult> {

  console.log("1 - Entró a processPWAImages");

  const generated =
    await generatePWAIcons(originalImage);

  console.log("2 - Iconos generados");

  const uploaded =
    await uploadGeneratedIcons(
      restaurantId,
      generated.icons
    );

  console.log("3 - Iconos subidos");

  const settings =
    await updatePWAAssets({
      restaurantId,
      appLogo,
      icons: uploaded,
    });

  console.log("4 - Base actualizada");

  return {
    icons: uploaded,
    settings,
  };
}