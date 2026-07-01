import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { optimizeImage } from "@/lib/image/optimizeImage";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data: restaurant, error } = await supabase
      .from("restaurants")
      .select("logo_url")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !restaurant?.logo_url) {
      return new NextResponse("Favicon no encontrado", {
        status: 404,
      });
    }

    const response = await fetch(restaurant.logo_url);

    if (!response.ok) {
      return new NextResponse("No fue posible descargar el logo", {
        status: 404,
      });
    }

    const imageBuffer = Buffer.from(
      await response.arrayBuffer()
    );

    const favicon = await optimizeImage(imageBuffer, {
      width: 64,
      height: 64,
      format: "png",
      quality: 100,
    });

const etag = `"${restaurant.logo_url}"`;

    return new Response(new Uint8Array(favicon), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control":
  "public, max-age=86400, stale-while-revalidate=604800",
      },
    });

  } catch (err) {
    console.error("Dynamic favicon:", err);

    return new NextResponse(
      "Error interno",
      {
        status: 500,
      }
    );
  }
}