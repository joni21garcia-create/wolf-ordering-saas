import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json(
        {
          success: false,
          error: "restaurantId requerido",
        },
        { status: 400 }
      );
    }

    // Buscar la última liquidación
    const { data: lastLiquidation, error: lastError } = await supabase
      .from("liquidations")
      .select("month, year")
      .eq("restaurant_id", restaurantId)
      .order("year", { ascending: false })
      .order("month", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) throw lastError;

    let month: number;
    let year: number;

    if (!lastLiquidation) {
      const today = new Date();

      month = today.getMonth() + 1;
      year = today.getFullYear();
    } else {
      month = lastLiquidation.month + 1;
      year = lastLiquidation.year;

      if (month > 12) {
        month = 1;
        year++;
      }
    }

    // Evitar duplicados
    const { data: existing } = await supabase
      .from("liquidations")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .eq("month", month)
      .eq("year", year)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "La liquidación ya existe.",
        },
        { status: 400 }
      );
    }

    // Crear registro vacío
    const { data: liquidation, error: insertError } = await supabase
      .from("liquidations")
      .insert({
        restaurant_id: restaurantId,
        month,
        year,
        sales_total: 0,
        wolf_total: 0,
        restaurant_total: 0,
        total_orders: 0,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      success: true,
      liquidation,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}