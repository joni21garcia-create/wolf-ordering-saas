import { NextResponse } from "next/server"; // Importación corregida
import { createClient } from "@supabase/supabase-js";
import { optimizeImage } from "@/lib/image/optimizeImage"; // Asegúrate de que esta ruta sea correcta
import { LOGO_PRESET } from "@/lib/image/presets";       // Asegúrate de que esta ruta sea correcta
import { processPWAImages } from "@/lib/pwa/processPWAImages";
import { updateManagerPWAAssets } from "@/lib/pwa/updateManagerPWAAssets";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ success: false, error: "Archivo requerido" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ success: false, error: "Formato no permitido" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ success: false, error: "Tamaño máximo 5MB" }, { status: 400 });

    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `manager/logo-original.${extension}`;

    const bytes = await file.arrayBuffer();
    const originalBuffer = Buffer.from(new Uint8Array(bytes));
    
    // Ahora optimizeImage debería funcionar porque ya está importado arriba
    const buffer = await optimizeImage(originalBuffer, LOGO_PRESET);

    const { error: uploadError } = await supabase.storage
      .from("restaurant-pwa")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("restaurant-pwa")
      .getPublicUrl(filePath);

    // Agregamos el timestamp para evitar la caché de imágenes rotas
    const freshPublicUrl = `${publicUrl}?t=${Date.now()}`;

    const pwaResult = await processPWAImages({
      folder: "manager",
      originalImage: buffer,
      appLogo: freshPublicUrl,
      updateAssets: async (icons, appLogo) => {
        return await updateManagerPWAAssets({
          appLogo,
          icons,
          tier: "manager",
        });
      },
    });

    return NextResponse.json({
      success: true,
      message: "Assets PWA generados correctamente.",
      logo: { path: filePath, url: freshPublicUrl },
      icons: pwaResult.icons,
      settings: pwaResult.settings,
    });

  } catch (error: any) {
    console.error("UPLOAD MANAGER PWA ERROR:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error interno al procesar imagen." },
      { status: 500 }
    );
  }
}