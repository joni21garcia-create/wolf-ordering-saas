import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/upload";

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const restaurantId = String(
      formData.get("restaurantId") ?? ""
    ).trim();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Archivo requerido",
          message: "Debes seleccionar una imagen QR.",
        },
        { status: 400 }
      );
    }

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurante requerido",
          message: "Falta restaurantId.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Formato no permitido",
          message:
            "El QR debe estar en PNG, JPG/JPEG o WebP.",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Tamaño inválido",
          message: "La imagen debe pesar como máximo 5 MB.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";

    const key = `restaurants/${restaurantId}/reservations/deposit-qr.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const result = await uploadFile({
      key,
      body: buffer,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      key: result.key,
      url: result.url,
    });
  } catch (error) {
    console.error(
      "[RESERVATION DEPOSIT QR UPLOAD]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Error subiendo QR",
        message:
          error instanceof Error
            ? error.message
            : "No pudimos subir la imagen QR.",
      },
      { status: 500 }
    );
  }
}