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
      fcm_token,
      platform = "android",
    } = await req.json();

    if (!restaurant_id || !fcm_token) {
      return NextResponse.json(
        { error: "restaurant_id y fcm_token son obligatorios" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("device_tokens")
      .upsert(
        {
          restaurant_id,
          user_id,
          fcm_token,
          platform,
          active: true,
        },
        {
          onConflict: "fcm_token",
        }
      );

    if (error) {
      console.error(error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}