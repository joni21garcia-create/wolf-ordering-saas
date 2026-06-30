import { NextResponse } from "next/server";
import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";
import { buildManagerManifest } from "@/lib/pwa/manifest/buildManagerManifest";

export async function GET() {
  try {
    // Obtenemos datos mediante la función dedicada (patrón limpio)
    const p = await getManagerPWASettings();
    const manifest = await buildManagerManifest();

    if (!p) {
      return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 });
    }

    // Estructuramos el manifiesto con la misma lógica que tu API de restaurante
    const finalManifest = {
      ...manifest,
      name: p.app_name || "Wolf Manager",
      short_name: p.short_name || "Wolf",
      start_url: "/login",
      scope: "/",
      display: p.display || "standalone",
      orientation: p.orientation || "portrait",
      background_color: p.background_color || "#000000",
      theme_color: p.theme_color || "#f97316",
      icons: [
        { src: p.icon_72_url, sizes: "72x72", type: "image/png" },
        { src: p.icon_96_url, sizes: "96x96", type: "image/png" },
        { src: p.icon_128_url, sizes: "128x128", type: "image/png" },
        { src: p.icon_144_url, sizes: "144x144", type: "image/png" },
        { src: p.icon_152_url, sizes: "152x152", type: "image/png" },
        { src: p.icon_192_url, sizes: "192x192", type: "image/png" },
        { src: p.icon_384_url, sizes: "384x384", type: "image/png" },
        { src: p.icon_512_url, sizes: "512x512", type: "image/png" },
        { src: p.maskable_icon_url, sizes: "512x512", type: "image/png", purpose: "maskable" }
      ].filter(i => i.src && i.src.startsWith('http')) 
    };

    return new NextResponse(JSON.stringify(finalManifest), {
      status: 200,
      headers: { "Content-Type": "application/manifest+json" },
    });
  } catch (error: any) {
    console.error("Error crítico en manifiesto:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}