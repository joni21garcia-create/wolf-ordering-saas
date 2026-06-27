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

    const {
      restaurantId,
      month,
      year,
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

    const existing =
      await supabase
        .from(
          "liquidations"
        )
        .select("id")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .eq(
          "month",
          month
        )
        .eq(
          "year",
          year
        )
        .maybeSingle();

    if (existing.data) {
      return NextResponse.json(
        {
          success: false,
          error:
            "La liquidación ya existe",
        },
        {
          status: 400,
        }
      );
    }

    const startDate =
      `${year}-${String(
        month
      ).padStart(
        2,
        "0"
      )}-01`;

    const endMonth =
      month === 12
        ? 1
        : month + 1;

    const endYear =
      month === 12
        ? year + 1
        : year;

    const endDate =
      `${endYear}-${String(
        endMonth
      ).padStart(
        2,
        "0"
      )}-01`;

    const {
      data: orders,
      error,
    } = await supabase
      .from("orders")
      .select("*")
      .eq(
        "restaurant_id",
        restaurantId
      )
      .eq(
        "status",
        "completed"
      )
      .gte(
        "created_at",
        startDate
      )
      .lt(
        "created_at",
        endDate
      );

    if (error) {
      throw error;
    }

    const salesTotal =
      orders.reduce(
        (acc, order) =>
          acc +
          Number(
            order.total ||
              0
          ),
        0
      );

    const wolfTotal =
      orders.reduce(
        (acc, order) =>
          acc +
          Number(
            order.wolf_amount ||
              0
          ),
        0
      );

    const restaurantTotal =
      orders.reduce(
        (acc, order) =>
          acc +
          Number(
            order.restaurant_amount ||
              0
          ),
        0
      );

    const totalOrders =
      orders.length;

    const {
      data:
        liquidation,
      error:
        insertError,
    } = await supabase
      .from(
        "liquidations"
      )
      .insert({
        restaurant_id:
          restaurantId,

        month,

        year,

        sales_total:
          salesTotal,

        wolf_total:
          wolfTotal,

        restaurant_total:
          restaurantTotal,

        total_orders:
          totalOrders,

        status:
          "pending",
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      liquidation,
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