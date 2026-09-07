import { NextResponse } from "next/server";
import { uploadOptimizedImage } from "@/lib/image/uploadOptimizedImage";
import { IMAGE_BUCKETS } from "@/lib/image/buckets";
import { GALLERY_PRESET } from "@/lib/image/presets";

/**
 * API dedicada para carga de documentos de repartidores (Wolf Delivery)
 * Ruta: /api/delivery/upload
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Obtenemos el archivo y metadatos
    const file = formData.get("file") as File | null;
    const driverId = formData.get("driverId") as string || "pending";
    const type = formData.get("type") as string || "general"; // selfie, doc_front, doc_back, evidence

    if (!file) {
      return NextResponse.json({ success: false, error: "Archivo requerido." }, { status: 400 });
    }

    // Convertimos a Buffer para procesar
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    // Nombre de archivo único: kyc_selfie_123456789.webp
    const fileName = `kyc_${type}_${Date.now()}.webp`;

    // Ruta organizada en R2: drivers/id_repartidor/kyc/archivo.webp
    const path = `drivers/${driverId}/kyc/${fileName}`;

    // Subida optimizada usando tu lógica existente
    // Usamos GALLERY_PRESET por defecto para buena calidad (1600px)
    const uploaded = await uploadOptimizedImage({
      buffer: buffer,
      bucket: IMAGE_BUCKETS.gallery, // O puedes crear un bucket nuevo "drivers"
      path: path,
      contentType: "image/webp",
    });

    return NextResponse.json({
      success: true,
      url: uploaded.url,
      path: path,
      type: type
    });

  } catch (error) {
    console.error("Error en upload de delivery:", error);
    return NextResponse.json({ success: false, error: "Error interno del servidor." }, { status: 500 });
  }
}