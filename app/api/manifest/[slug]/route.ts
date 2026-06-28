import { NextResponse } from "next/server";

import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";
import { buildRestaurantManifest } from "@/lib/pwa/manifest/buildRestaurantManifest";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: Request,
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
      "Content-Type":
        "application/manifest+json",

      "Cache-Control":
        "public, max-age=300",
    },
  });
}