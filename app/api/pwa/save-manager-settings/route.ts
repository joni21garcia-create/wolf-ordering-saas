import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sanitizedData = {
      app_name: body.app_name || "Wolf Ordering Manager",
      short_name: body.short_name || "Wolf Manager",
      description: body.description || "",
      app_logo: (body.app_logo && typeof body.app_logo === 'string' && body.app_logo.startsWith('http')) 
                ? body.app_logo 
                : null,
      theme_color: body.theme_color || "#f97316",
      background_color: body.background_color || "#111827",
      display: body.display || "standalone",
      orientation: body.orientation || "portrait",
      updated_at: new Date().toISOString(),
    };

    // Buscamos si ya existe algún registro (al ser una sola config de manager)
    const { data: existing } = await supabase
      .from("manager_pwa_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    let result;

    if (existing) {
      // Si existe, actualizamos usando su UUID real
      const { data, error } = await supabase
        .from("manager_pwa_settings")
        .update(sanitizedData)
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Si no existe, insertamos (el ID se generará solo)
      const { data, error } = await supabase
        .from("manager_pwa_settings")
        .insert(sanitizedData)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, settings: result });
  } catch (error: any) {
    console.error("Error en save-manager-settings:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}