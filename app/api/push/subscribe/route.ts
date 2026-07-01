import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      restaurant_id,
      user_id,
      subscription,
      user_agent,
    } = await req.json();

    if (!subscription) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscription requerida",
        },
        {
          status: 400,
        }
      );
    }

    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          restaurant_id,
          user_id,

          // Endpoint único del dispositivo
          endpoint: subscription.endpoint,

          // Suscripción completa (JSON)
          subscription,

          // Información del navegador
          user_agent,

          active: true,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "endpoint",
        }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Suscripción registrada correctamente",
    });

  } catch (error) {
    console.error(
      "Error registrando Push:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible registrar la suscripción",
      },
      {
        status: 500,
      }
    );
  }
}