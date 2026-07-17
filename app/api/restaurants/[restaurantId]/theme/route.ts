import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id?: string; restaurantId?: string }> }
) {
  try {
    const params = await context.params;
    const id = params?.id || params?.restaurantId;

    // Validación robusta y flexible ante cualquier nombre de parámetro
    if (!id || id === "undefined" || id.trim() === "") {
      console.error("--> Error crítico: El ID llegó vacío o undefined. Params:", params);
      return NextResponse.json(
        { success: false, error: "El ID del restaurante es inválido o no está presente." },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("--> ID limpio procesado:", id);

    const {
      theme_style,
      primary_color,
      secondary_color,
      background_color,
      text_color,
      button_style,
      font_family,
      card_style,
      hero_overlay,
      glow_effect,
      animation_style,
      shadow_intensity,
      radius,
      card_border,
    } = body;

    const { data, error } = await supabase
      .from("restaurant_theme_settings")
      .upsert(
        {
          restaurant_id: id,
          theme_style,
          primary_color,
          secondary_color,
          background_color,
          text_color,
          button_style,
          font_family,
          card_style,
          hero_overlay,
          glow_effect,
          animation_style,
          shadow_intensity,
          radius,
          card_border,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "restaurant_id" }
      )
      .select()
      .single();

    if (error) {
      console.error("--- ERROR DE SUPABASE ---", error);
      return NextResponse.json(
        { success: false, error: error.message, details: error.details },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      theme: data,
    });
  } catch (error: any) {
    console.error("--- INTERNAL ERROR EN API ---", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}