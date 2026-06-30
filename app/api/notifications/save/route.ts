import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializamos el cliente de Supabase usando la Service Role Key
// IMPORTANTE: Asegúrate de que SUPABASE_SERVICE_ROLE_KEY esté en tu .env
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { subscription, restaurant_id } = await request.json();

    if (!subscription) {
      return NextResponse.json({ error: "Suscripción requerida" }, { status: 400 });
    }

    // Guardamos la suscripción en la tabla 'push_subscriptions'
    // Asegúrate de tener esta tabla creada en tu Supabase
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert({
        restaurant_id: restaurant_id, // Identificador del manager/restaurante
        subscription: subscription,   // El objeto JSON completo
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}