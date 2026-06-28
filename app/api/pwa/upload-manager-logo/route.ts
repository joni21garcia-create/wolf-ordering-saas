import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { optimizeImage } from "@/lib/image/optimizeImage";
import { LOGO_PRESET } from "@/lib/image/presets";

import { processPWAImages } from "@/lib/pwa/processPWAImages";
import { updateManagerPWAAssets } from "@/lib/pwa/updateManagerPWAAssets";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Debe seleccionar un archivo.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(file.type)
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

    if (file.size > MAX_SIZE) {
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

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "png";

    const filePath =
      `manager/logo-original.${extension}`;

    const bytes =
      await file.arrayBuffer();

    const originalBuffer =
      Buffer.from(bytes);

    const buffer =
      await optimizeImage(
        originalBuffer,
        LOGO_PRESET
      );

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("restaurant-pwa")
        .upload(
          filePath,
          buffer,
          {
            contentType: file.type,
            upsert: true,
          }
        );

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: publicUrl,
    } =
      supabase.storage
        .from("restaurant-pwa")
        .getPublicUrl(filePath);

    const pwaResult =
      await processPWAImages({

        folder: "manager",

        originalImage: buffer,

        appLogo:
          publicUrl.publicUrl,

        updateAssets: (
          icons,
          appLogo
        ) =>
          updateManagerPWAAssets({
            appLogo,
            icons,
          }),

      });

    return NextResponse.json({

      success: true,

      message:
        "Logo e iconos PWA generados correctamente.",

      logo: {
        path: filePath,
        url: publicUrl.publicUrl,
      },

      icons: pwaResult.icons,

      settings:
        pwaResult.settings,

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
          "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );

  }

}