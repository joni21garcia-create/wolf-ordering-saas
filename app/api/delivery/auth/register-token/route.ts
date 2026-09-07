import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { driverId, token, restaurantId } = await request.json();

    if (!driverId || !token || !restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos faltantes",
        },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("push_subscriptions")
      .upsert(
        {
          user_id: driverId,
          restaurant_id: restaurantId,
          fcm_token: token,
          platform: "android",
          active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "fcm_token" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}