import { NextResponse } from "next/server";
import { optimizeImage } from "@/lib/image/optimizeImage";

import { uploadOptimizedImage } from "@/lib/image/uploadOptimizedImage";
import { IMAGE_BUCKETS } from "@/lib/image/buckets";

import {
  LOGO_PRESET,
  HERO_PRESET,
  GALLERY_PRESET,
  PRODUCT_PRESET,
  CATEGORY_PRESET,
  PROMOTION_PRESET,
  BANNER_PRESET,
} from "@/lib/image/presets";

const PRESETS = {
  logo: LOGO_PRESET,
  hero: HERO_PRESET,
  gallery: GALLERY_PRESET,
  product: PRODUCT_PRESET,
  category: CATEGORY_PRESET,
  promotion: PROMOTION_PRESET,
  banner: BANNER_PRESET,
};

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

    const preset =
      formData.get("preset") as string | null;

    //----------------------------------
    // Validaciones
    //----------------------------------

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo requerido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "restaurantId requerido.",
        },
        {
          status: 400,
        }
      );
    }

    if (!preset) {
      return NextResponse.json(
        {
          success: false,
          error: "Preset requerido.",
        },
        {
          status: 400,
        }
      );
    }

    //----------------------------------
    // Buscar preset
    //----------------------------------

    const selectedPreset =
      PRESETS[
        preset as keyof typeof PRESETS
      ];

    if (!selectedPreset) {
      return NextResponse.json(
        {
          success: false,
          error: "Preset no válido.",
        },
        {
          status: 400,
        }
      );
    }


//----------------------------------
// Optimizar imagen (Versión Ultra-Segura para Vercel)
//----------------------------------

const arrayBuffer = await file.arrayBuffer();

// Usamos Buffer.from directamente pasándole el ArrayBuffer,
// que es la forma nativa y estándar recomendada por Next.js
const originalBuffer = Buffer.from(arrayBuffer);

const optimizedBuffer = await optimizeImage(
  originalBuffer,
  selectedPreset
);

//----------------------------------
// Nombre del archivo
//----------------------------------

const extension =
  selectedPreset.format;

const fileName =
  `${Date.now()}.${extension}`;

//----------------------------------
// Bucket
//----------------------------------

const bucket =
  preset === "gallery"
    ? IMAGE_BUCKETS.gallery
    : IMAGE_BUCKETS.landing;

//----------------------------------
// Ruta
//----------------------------------

const path =
  preset === "gallery"
    ? `${restaurantId}/${fileName}`
    : `restaurants/${restaurantId}/${fileName}`;

//----------------------------------
// Upload
//----------------------------------

const uploaded =
  await uploadOptimizedImage({
    buffer: optimizedBuffer,
    bucket,
    path,
    contentType:
      extension === "png"
        ? "image/png"
        : "image/webp",
});

//----------------------------------
// Respuesta
//----------------------------------

return NextResponse.json({
  success: true,

  url: uploaded.url,

  bucket,

  path,

  preset,
});

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno.",
      },
      {
        status: 500,
      }
    );

  }
}