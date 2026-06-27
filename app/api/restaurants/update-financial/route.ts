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
      restaurantId,

      commissionMode,

      commissionType,

      commissionPercentage,

      commissionActive,
    } = body;

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "restaurantId requerido",
        },
        {
          status: 400,
        }
      );
    }

    const updateData: any = {
      commission_mode:
        commissionMode,
    };

    if (
      commissionMode ===
      "custom"
    ) {
      updateData.commission_type =
        commissionType;

      updateData.commission_percentage =
        commissionPercentage;

      updateData.commission_active =
        commissionActive;
    }

    const { error } =
      await supabase
        .from("restaurants")
        .update(updateData)
        .eq(
          "id",
          restaurantId
        );

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
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}