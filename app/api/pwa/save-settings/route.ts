import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {

    const body =
      await request.json();

    const {
      restaurant_id,

      app_name,

      short_name,

      description,

      theme_color,

      background_color,

      display,

      orientation,

      app_logo,
    } = body;

    const {
      data,
      error,
    } =
      await supabase
        .from(
          "restaurant_pwa_settings"
        )
        .upsert(
          {
            restaurant_id,

            app_name,

            short_name,

            description,

            theme_color,

            background_color,

            display,

            orientation,

            app_logo,
          },
          {
            onConflict:
              "restaurant_id",
          }
        )
        .select()
        .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
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