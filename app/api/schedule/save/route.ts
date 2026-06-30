import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: Fuerza que esta ruta sea dinámica, evitando caché en servidores de Vercel
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { restaurantId, schedule } = body;

    // Validación básica para evitar errores de ejecución
    if (!restaurantId || !schedule) {
      throw new Error("Datos incompletos: faltan restaurantId o schedule");
    }

    const { error } = await supabase
      .from("schedule_settings")
      .upsert(
        {
          restaurant_id: restaurantId,
          ...schedule,
        },
        {
          onConflict: "restaurant_id",
        }
      );

    if (error) {
      console.error("Supabase UPSERT error:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    // Esto aparecerá en los 'Function Logs' de tu panel de Vercel
    console.error("Error crítico al guardar horarios:", error.message);
    
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