import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// FORZAR DINAMISMO TOTAL
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Saving schedule for:", body.restaurantId); // Diagnóstico en Vercel Logs

    const { restaurantId, schedule } = body;

    const { error } = await supabase
      .from("schedule_settings")
      .upsert(
        {
          restaurant_id: restaurantId,
          ...schedule,
        },
        { onConflict: "restaurant_id" }
      );

    if (error) {
      console.error("Supabase UPSERT Error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API SAVE Schedule Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}