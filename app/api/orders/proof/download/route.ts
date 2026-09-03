import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { r2 } from "@/lib/storage/r2";

export const dynamic = "force-dynamic";

function getR2Key(value: string): string | null {
  try {
    const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

    if (!publicBase) return null;

    const url = new URL(value);
    const base = new URL(publicBase);

    if (url.origin !== base.origin) {
      return null;
    }

    const basePath = base.pathname.replace(/\/$/, "");

    if (!url.pathname.startsWith(`${basePath}/`)) {
      return null;
    }

    const key = decodeURIComponent(
      url.pathname.slice(basePath.length + 1)
    );

    if (!key || !key.startsWith("payment-proofs/")) {
      return null;
    }

    return key;
  } catch {
    return null;
  }
}

function safeFileName(value: string): string {
  return (
    value
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "comprobante-pago"
  );
}

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("url");
  const key = value ? getR2Key(value) : null;

  if (!key) {
    return NextResponse.json(
      { error: "URL de comprobante no permitida" },
      { status: 400 }
    );
  }

  try {
    const result = await r2.send(
      new GetObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
      })
    );

    if (!result.Body) {
      return NextResponse.json(
        { error: "Comprobante no encontrado" },
        { status: 404 }
      );
    }

    const filename = safeFileName(
      key.split("/").pop() || "comprobante-pago"
    );

    const headers = new Headers();

    headers.set(
      "Content-Type",
      result.ContentType || "application/octet-stream"
    );

    headers.set(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    headers.set("Cache-Control", "no-store, max-age=0");

    if (result.ContentLength != null) {
      headers.set("Content-Length", String(result.ContentLength));
    }

    const bytes = await result.Body.transformToByteArray();

    const arrayBuffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    ) as ArrayBuffer;

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error(
      "[proof/download] Error descargando comprobante:",
      error
    );

    return NextResponse.json(
      { error: "No se pudo descargar el comprobante" },
      { status: 500 }
    );
  }
}
