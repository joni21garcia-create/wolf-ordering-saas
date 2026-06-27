import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Obtener el único registro existente
    const { data: current, error: findError } = await supabase
      .from("manager_pwa_settings")
      .select("id")
      .limit(1)
      .single();

    if (findError) {
      throw findError;
    }

    // Actualizar ese registro
    const { data, error } = await supabase
      .from("manager_pwa_settings")
      .update({
        app_name: body.app_name,
        short_name: body.short_name,
        description: body.description,
        app_logo: body.app_logo,
        theme_color: body.theme_color,
        background_color: body.background_color,
        display: body.display,
        orientation: body.orientation,
        updated_at: new Date().toISOString(),
      })
      .eq("id", current.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible guardar la configuración.",
      },
      {
        status: 500,
      }
    );
  }
}