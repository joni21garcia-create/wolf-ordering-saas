import { NextResponse } from "next/server";

import { buildManagerManifest } from "@/lib/pwa/manifest/buildManagerManifest";

export async function GET() {
  try {
    const manifest =
      await buildManagerManifest();

    return NextResponse.json(
      manifest,
      {
        headers: {
          "Content-Type":
            "application/manifest+json",
        },
      }
    );
  } catch (error) {
    console.error(
      "MANAGER MANIFEST:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "No fue posible generar el manifest.",
      },
      {
        status: 500,
      }
    );
  }
}