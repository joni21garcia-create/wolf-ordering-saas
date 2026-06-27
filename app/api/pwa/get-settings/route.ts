import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest
) {
  try {
    const restaurantId =
      request.nextUrl.searchParams.get(
        "restaurantId"
      );

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "restaurantId es requerido",
        },
        {
          status: 400,
        }
      );
    }

    const {
  data,
  error,
} = await supabase
  .from("restaurant_pwa_settings")
  .select("*")
  .eq(
    "restaurant_id",
    restaurantId
  )
  .maybeSingle();

    if (error) {
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

    return NextResponse.json({
      success: true,
      settings: data,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}