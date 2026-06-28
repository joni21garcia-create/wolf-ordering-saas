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

  console.log("1 - Entró a processPWAImages");

  const generated =
    await generatePWAIcons(originalImage);

  console.log("2 - Iconos generados");

  const uploaded =
    await uploadGeneratedIcons({
      folder,
      icons: generated.icons,
    });

  console.log("3 - Iconos subidos");

  const settings =
    await updateAssets(
      uploaded,
      appLogo
    );

  console.log("4 - Base actualizada");

  return {
    icons: uploaded,
    settings,
  };
}