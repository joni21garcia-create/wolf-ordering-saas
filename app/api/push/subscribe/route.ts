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

    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          restaurant_id,
          user_id: user_id ?? null,

          endpoint: subscription.endpoint,

          subscription,

          user_agent,

          active: true,

          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "endpoint",
        }
      )
      .select("id")
      .maybeSingle();

if (error) throw error;

if (!data) {
  return NextResponse.json(
    {
      success: false,
      error: "No fue posible registrar la suscripción",
    },
    {
      status: 500,
    },
  );
}

return NextResponse.json({
  success: true,
  subscription_id: data.id,
});
  } catch (error) {
    console.error("[REGISTER WEB]", error);

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