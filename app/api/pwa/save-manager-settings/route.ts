import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const cleanUrl = (url: any) => {
      return (
        typeof url === "string" &&
        url.trim() !== "" &&
        url.startsWith("http")
      )
        ? url
        : "";
    };

    const sanitizedData = {
      app_name: body.app_name || "Wolf Ordering Manager",
      short_name: body.short_name || "Wolf Manager",
      description: body.description || "",

      app_logo: cleanUrl(body.app_logo),

      // ✅ Guardar todas las URLs de iconos
      icon_72_url: cleanUrl(body.icon_72_url),
      icon_96_url: cleanUrl(body.icon_96_url),
      icon_128_url: cleanUrl(body.icon_128_url),
      icon_144_url: cleanUrl(body.icon_144_url),
      icon_152_url: cleanUrl(body.icon_152_url),
      icon_192_url: cleanUrl(body.icon_192_url),
      icon_384_url: cleanUrl(body.icon_384_url),
      icon_512_url: cleanUrl(body.icon_512_url),
      maskable_icon_url: cleanUrl(body.maskable_icon_url),

      theme_color: body.theme_color || "#f97316",
      background_color: body.background_color || "#111827",
      display: body.display || "standalone",
      orientation: body.orientation || "portrait",

      updated_at: new Date().toISOString(),
    };

    // Buscar si ya existe el registro único del Manager
    const { data: existing } = await supabase
      .from("manager_pwa_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let result;

    if (existing) {
      const { data, error } = await supabase
        .from("manager_pwa_settings")
        .update(sanitizedData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;

      result = data;
    } else {
      const { data, error } = await supabase
        .from("manager_pwa_settings")
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;

      result = data;
    }

    return NextResponse.json({
      success: true,
      settings: result,
    });

  } catch (error: any) {
    console.error("Error en save-manager-settings:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}


