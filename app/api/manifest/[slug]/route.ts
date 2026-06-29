import { NextRequest, NextResponse } from "next/server";

import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";
import { buildRestaurantManifest } from "@/lib/pwa/manifest/buildRestaurantManifest";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    slug?: string; // 🛠️ Lo hacemos opcional para que no crashee si viene vacío
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  // 1. Intentamos obtener el slug desde los parámetros de la ruta
  const resolvedParams = await params;
  let slug = resolvedParams?.slug;

  // 2. ESTRATEGIA DE RESPALDO: Si no viene en params, lo extraemos del Referer (la URL de la pestaña del navegador)
  if (!slug) {
    const referer = request.headers.get("referer"); // Ejemplo: https://app.wolfordering.com/demo/order
    if (referer) {
      try {
        const urlObj = new URL(referer);
        const pathSegments = urlObj.pathname.split("/").filter(Boolean);
        // Si la URL es /demo o /demo/order, el primer segmento es el slug de tu restaurante ("demo")
        if (pathSegments.length > 0 && pathSegments[0] !== "api") {
          slug = pathSegments[0];
        }
      } catch (e) {
        console.error("Error procesando URL del referer:", e);
      }
    }
  }

  // 3. SEGUNDA ESTRATEGIA: Por si acaso lo estás enviando como ?slug=demo query param
  if (!slug) {
    slug = request.nextUrl.searchParams.get("slug") || undefined;
  }

  // Si después de todos los intentos no hay slug, usamos "demo" como último recurso para evitar pantallas en blanco
  if (!slug) {
    slug = "demo";
  }

  console.log("=== MANIFEST GENERATOR ===");
  console.log("Buscando manifiesto para el slug:", slug);

  const restaurant = await getRestaurantMetadata(slug);

  if (!restaurant) {
    return NextResponse.json(
      { error: `Restaurant '${slug}' not found` },
      { status: 404 }
    );
  }

  const manifest = buildRestaurantManifest(restaurant);

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", // 🛠️ Forzamos al navegador a pedirlo siempre fresco
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}