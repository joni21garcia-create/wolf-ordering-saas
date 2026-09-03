import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isAllowedProofUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const configured = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!configured) return false;

    const origin = new URL(configured).origin;
    return url.origin === origin && url.pathname.includes("/storage/v1/object/");
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("url");

  if (!value || !isAllowedProofUrl(value)) {
    return NextResponse.json({ error: "URL de comprobante no permitida" }, { status: 400 });
  }

  try {
    const upstream = await fetch(value, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: "No se pudo obtener el comprobante" },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "application/octet-stream";
    const contentLength = upstream.headers.get("content-length");
    const pathname = new URL(value).pathname;
    const original = pathname.split("/").pop() || "comprobante-pago";
    const filename = original.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120) || "comprobante-pago";

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    headers.set("Cache-Control", "no-store, max-age=0");
    if (contentLength) headers.set("Content-Length", contentLength);

    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (error) {
    console.error("[proof-download]", error);
    return NextResponse.json({ error: "Error descargando comprobante" }, { status: 500 });
  }
}
