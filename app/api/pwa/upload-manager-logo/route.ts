import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/upload";
import { getPublicUrl } from "@/lib/storage/signed-url";

import { optimizeImage } from "@/lib/image/optimizeImage";
import { LOGO_PRESET } from "@/lib/image/presets";

import { processPWAImages } from "@/lib/pwa/processPWAImages";
import { updateManagerPWAAssets } from "@/lib/pwa/updateManagerPWAAssets";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file =
      formData.get("file") as File | null;

    //----------------------------------
    // Validaciones
    //----------------------------------

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo requerido",
        },
        {
          status: 400,
        }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato no permitido",
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Tamaño máximo 5MB",
        },
        {
          status: 400,
        }
      );
    }

    //----------------------------------
    // Nombre del archivo
    //----------------------------------

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    const filePath =
      `manager/logo-original.${extension}`;

    //----------------------------------
    // Leer archivo
    //----------------------------------

    const bytes =
      await file.arrayBuffer();

    const originalBuffer =
      Buffer.from(new Uint8Array(bytes));

    //----------------------------------
    // Optimizar
    //----------------------------------

    const buffer =
      await optimizeImage(
        originalBuffer as any,
        LOGO_PRESET
      );

    //----------------------------------
    // Upload R2
    //----------------------------------

    const key =
      `restaurant-pwa/${filePath}`;

    await uploadFile({
      key,
      body: buffer,
      contentType: file.type,
    });

    //----------------------------------
    // URL pública
    //----------------------------------

    const logoUrl =
      `${getPublicUrl(key)}?t=${Date.now()}`;

    //----------------------------------
    // Generar assets PWA
    //----------------------------------

    const pwaResult =
      await processPWAImages({
        folder: "manager",

        originalImage:
          buffer as any,

        appLogo: logoUrl,

        updateAssets: async (
          icons,
          appLogo
        ) =>
          updateManagerPWAAssets({
            appLogo,
            icons,
            tier: "manager",
          }),
      });

    //----------------------------------
    // Respuesta
    //----------------------------------

    return NextResponse.json({
      success: true,

      message:
        "Assets PWA generados correctamente.",

      logo: {
        path: filePath,
        url: logoUrl,
      },

      icons: pwaResult.icons,

      settings: pwaResult.settings,
    });

  } catch (error: any) {

    console.error(
      "UPLOAD MANAGER PWA ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ??
          "Error interno al procesar imagen.",
      },
      {
        status: 500,
      }
    );
  }
}