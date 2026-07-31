import { NextResponse } from "next/server";

import { uploadFile } from "@/lib/storage/upload";
import { getPublicUrl } from "@/lib/storage/signed-url";

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
          error: "La imagen supera el tamaño máximo permitido (5MB).",
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

    const fileName =
      `${Date.now()}.${extension}`;

    const key =
      `landing-images/payment-qrs/${fileName}`;

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(new Uint8Array(bytes));

    await uploadFile({
      key,
      body: buffer,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: getPublicUrl(key),
    });

  } catch (error: any) {

    console.error(
      "QR UPLOAD ERROR:",
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