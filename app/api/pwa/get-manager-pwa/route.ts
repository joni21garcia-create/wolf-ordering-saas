import { NextResponse } from "next/server";
import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";

export async function GET() {
  try {
    const settings = await getManagerPWASettings();

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          error: "No existe configuración.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno.",
      },
      {
        status: 500,
      }
    );
  }
}