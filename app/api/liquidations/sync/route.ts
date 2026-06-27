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

const {
  data: liquidation,
  error: liquidationError,
} = await supabase
  .from("liquidations")
  .select("*")
  .eq(
    "id",
    liquidationId
  )
  .single();

if (
  liquidationError ||
  !liquidation
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Liquidación no encontrada",
    },
    {
      status: 404,
    }
  );
}

const {
  data: orders,
  error: ordersError,
} = await supabase
  .from("orders")
  .select("*")
  .eq(
    "restaurant_id",
    liquidation.restaurant_id
  )
  .eq(
    "status",
    "completed"
  );

if (ordersError) {
  throw ordersError;
}

const salesTotal =
  orders.reduce(
    (acc, order) =>
      acc +
      Number(
        order.total || 0
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

const { error } =
  await supabase
    .from("liquidations")
    .update({
      sales_total:
        salesTotal,
      wolf_total:
        wolfTotal,
      restaurant_total:
        restaurantTotal,
      total_orders:
        totalOrders,
    })
    .eq(
      "id",
      liquidation.id
    );

if (error) {
  throw error;
}

return NextResponse.json({
  success: true,
});

} catch (error: any) {
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
}