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
    ?.split(".")
    ?.pop()
    ?.toLowerCase() ?? "png";

    const filePath =
      `manager/logo-original.${extension}`;

    const bytes =
      await file.arrayBuffer();

    // 🛠️ SOLUCIÓN: Envolver en Uint8Array para evitar corrupción en Vercel
    const originalBuffer =
      Buffer.from(new Uint8Array(bytes));

    // 🛠️ SOLUCIÓN: Castear "as any" para evitar que TypeScript rompa el build
    const buffer =
      await optimizeImage(
        originalBuffer as any,
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

        // 🛠️ SOLUCIÓN: Asegurar también el buffer aquí por si acaso
        originalImage: buffer as any,

        appLogo:
          publicUrl.publicUrl,

        updateAssets: (
          icons,
          appLogo
        ) =>
          updateManagerPWAAssets({
            appLogo,
            icons,
            tier: "manager", // Asegúrate si tu tipado exige parámetros extra aquí, si no, déjalo igual
          } as any), // Casteo preventivo en la ejecución interna

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