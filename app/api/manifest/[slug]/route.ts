import { NextRequest, NextResponse } from "next/server"; // 🛠️ FIX: Usar NextRequest nativo de Next.js

import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";
import { buildRestaurantManifest } from "@/lib/pwa/manifest/buildRestaurantManifest";

// 🛠️ FIX: Evitar que Vercel intente cachear o congelar este manifest en el build estático
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: NextRequest, // 🛠️ FIX: Cambiado de Request a NextRequest
  { params }: Props
) {
  const { slug } = await params;

  const restaurant =
    await getRestaurantMetadata(slug);

  if (!restaurant) {
    return NextResponse.json(
      {
        error: "Restaurant not found",
      },
      {
        status: 404,
      }
    );
  }

  const manifest =
    buildRestaurantManifest(restaurant);

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=0, must-revalidate", // 🛠️ FIX: Evitar bloqueos de caché vieja mientras pruebas
    },
  });
}