import { NextResponse } from "next/server";
import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";

export async function GET() {
  try {
    const settings = await getManagerPWASettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible cargar la configuración.",
      },
      {
        status: 500,
      }
    );
  }
}