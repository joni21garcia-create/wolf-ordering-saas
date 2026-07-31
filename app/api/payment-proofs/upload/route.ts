import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/upload";
import { getPublicUrl } from "@/lib/storage/signed-url";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;

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

    const extension =
      file.name.split(".").pop() || "jpg";

    const key =
      `payment-proofs/${Date.now()}.${extension}`;

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    await uploadFile({
      key,
      body: buffer,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      url: getPublicUrl(key),
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