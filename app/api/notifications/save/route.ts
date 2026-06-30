import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers"; // Necesario para obtener la sesión

export async function POST(request: Request) {
  try {
    const { subscription } = await request.json();

    // 1. Inicializar Supabase con las cookies del usuario
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Obtener el usuario actual de forma segura
    // (Asegúrate de que el usuario ya haya iniciado sesión en tu app)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    // 3. Upsert usando el ID del usuario autenticado
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert({
        restaurant_id: user.id, // Se usa el ID del usuario logueado
        subscription: subscription,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'restaurant_id' }); // IMPORTANTE: Define la restricción de conflicto

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error en API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}