import { NextResponse } from "next/server";
import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const restaurant = await getRestaurantMetadata(slug);

    if (!restaurant || !restaurant.pwaSettings) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 });
    }

    const p = restaurant.pwaSettings;

    // Construcción del manifest con validación para evitar errores de instalación
    const manifest = {
      name: p.app_name || restaurant.name || "Wolf Ordering",
      short_name: p.short_name || "Wolf",
      description: p.description || "",
      start_url: `/${restaurant.slug}`,
      display: "standalone", // Fuerza la eliminación de la barra de navegación
      orientation: "portrait",
      background_color: p.background_color || "#050505",
      theme_color: p.theme_color || "#050505",
      icons: [
        { src: p.icon_72_url, sizes: "72x72", type: "image/png" },
        { src: p.icon_96_url, sizes: "96x96", type: "image/png" },
        { src: p.icon_128_url, sizes: "128x128", type: "image/png" },
        { src: p.icon_144_url, sizes: "144x144", type: "image/png" },
        { src: p.icon_192_url, sizes: "192x192", type: "image/png" },
        { src: p.icon_512_url, sizes: "512x512", type: "image/png" },
        { src: p.maskable_icon_url, sizes: "512x512", type: "image/png", purpose: "maskable" }
      ].filter(icon => icon.src) // CRUCIAL: Elimina iconos vacíos que bloquean la instalación
    };

    return new NextResponse(JSON.stringify(manifest), {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=86400", // Mejora velocidad de carga
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}