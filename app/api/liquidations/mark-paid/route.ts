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

    const liquidationId =
      body.liquidationId;

    console.log(
      "LIQUIDATION ID:",
      liquidationId
    );

    if (!liquidationId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No se recibió liquidationId",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("liquidations")
        .update({
          status: "paid",
          paid_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          liquidationId
        );

    if (error) {
      console.error(
        "SUPABASE ERROR:",
        error
      );

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
    });

  } catch (error: any) {
    console.error(
      "CATCH ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}