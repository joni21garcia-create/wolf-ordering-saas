import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/upload";
import { getPublicUrl } from "@/lib/storage/signed-url";
import { optimizeImage } from "@/lib/image/optimizeImage";
import { LOGO_PRESET } from "@/lib/image/presets";

import { processPWAImages } from "@/lib/pwa/processPWAImages";
import { updatePWAAssets } from "@/lib/pwa/updatePWAAssets";



const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(
  request: Request
) {
  try {

    const formData =
      await request.formData();

    const file =
      formData.get("file") as File | null;

    const restaurantId =
      formData.get("restaurantId") as string | null;

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "restaurantId es requerido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Debe seleccionar un archivo.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Formato no permitido. Use PNG, JPG o WEBP.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size > MAX_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La imagen supera el tamaño máximo permitido (5MB).",
        },
        {
          status: 400,
        }
      );
    }

    // 🛠️ SOLUCIÓN TYPECHECK: Agregado encadenamiento opcional para el build de Vercel
    const extension =
      file?.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    const filePath =
      `${restaurantId}/logo-original.${extension}`;

    const bytes =
      await file.arrayBuffer();

    // 🛠️ SOLUCIÓN BUFFER: Envoltura Uint8Array para evitar corrupción en producción
    const originalBuffer =
      Buffer.from(new Uint8Array(bytes));

    // 🛠️ SOLUCIÓN TYPESCRIPT: Casteo 'as any' para evitar bloqueos del compilador
    const buffer =
      await optimizeImage(
        originalBuffer as any,
        LOGO_PRESET
      );

    console.log(
      "Optimizado:",
      buffer.length,
      buffer.subarray(0, 8)
    );

 const key = `restaurant-pwa/${filePath}`;

await uploadFile({
  key,
  body: buffer,
  contentType: file.type,
});

const logoUrl = getPublicUrl(key);

    const pwaResult =
      await processPWAImages({
        folder: `restaurants/${restaurantId}`,

        // 🛠️ SOLUCIÓN TYPESCRIPT: Casteo 'as any' para mantener la compatibilidad
        originalImage: buffer as any,

        appLogo: logoUrl,

        updateAssets: (
          icons,
          appLogo
        ) =>
          updatePWAAssets({
            restaurantId,
            appLogo,
            icons,
          } as any),
      });

    return NextResponse.json({
      success: true,

      message:
        "Logo e iconos PWA generados correctamente.",

      logo: {
        path: filePath,
        url: logoUrl,
      },

      icons: pwaResult.icons,

      settings: pwaResult.settings,
    });

  } catch (error: any) {

    console.error(
      "UPLOAD PWA ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error?.message ??
          "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );

  }
}


