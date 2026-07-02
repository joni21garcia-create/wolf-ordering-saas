import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const liquidationId = body.liquidationId;

    if (!liquidationId) {
      return NextResponse.json(
        {
          success: false,
          error: "liquidationId requerido",
        },
        {
          status: 400,
        }
      );
    }

    // Buscar la liquidación
    const {
      data: liquidation,
      error: liquidationError,
    } = await supabase
      .from("liquidations")
      .select("*")
      .eq("id", liquidationId)
      .maybeSingle();

    if (liquidationError || !liquidation) {
      return NextResponse.json(
        {
          success: false,
          error: "Liquidación no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    // Calcular el rango del mes de la liquidación
    const startDate = `${liquidation.year}-${String(
      liquidation.month
    ).padStart(2, "0")}-01`;

    const endMonth =
      liquidation.month === 12
        ? 1
        : liquidation.month + 1;

    const endYear =
      liquidation.month === 12
        ? liquidation.year + 1
        : liquidation.year;

    const endDate = `${endYear}-${String(
      endMonth
    ).padStart(2, "0")}-01`;

    // Buscar únicamente pedidos del mes
    const {
      data: orders,
      error: ordersError,
    } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", liquidation.restaurant_id)
      .eq("status", "completed")
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (ordersError) {
      throw ordersError;
    }

    const salesTotal = orders.reduce(
      (acc, order) =>
        acc + Number(order.total || 0),
      0
    );

    const wolfTotal = orders.reduce(
      (acc, order) =>
        acc + Number(order.wolf_amount || 0),
      0
    );

    const restaurantTotal = orders.reduce(
      (acc, order) =>
        acc +
        Number(order.restaurant_amount || 0),
      0
    );

    const totalOrders = orders.length;

    console.log("========= ACTUALIZAR LIQUIDACIÓN =========");
    console.log({
      liquidationId,
      month: liquidation.month,
      year: liquidation.year,
      startDate,
      endDate,
      orders: totalOrders,
      salesTotal,
      wolfTotal,
      restaurantTotal,
    });

    const {
      error: updateError,
    } = await supabase
      .from("liquidations")
      .update({
        sales_total: salesTotal,
        wolf_total: wolfTotal,
        restaurant_total: restaurantTotal,
        total_orders: totalOrders,
      })
      .eq("id", liquidation.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      salesTotal,
      wolfTotal,
      restaurantTotal,
      totalOrders,
    });
  } catch (error: any) {
    console.error(error);

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
}