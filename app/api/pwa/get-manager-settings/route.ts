import { NextResponse } from "next/server";
import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";

export async function GET() {
  try {
    const settings = await getManagerPWASettings();

    return NextResponse.json({
      success: true,
      settings: settings || {},
    });
  } catch (error: any) {
    // Ajustado para coincidir con la ruta real de tu archivo
    console.error("Error en GET /api/pwa/get-manager-settings:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar la configuración del manager.",
      },
      {
        status: 500,
      }
    );
  }
}