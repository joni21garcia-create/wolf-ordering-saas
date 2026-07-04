import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  isRestaurantOpen,
} from "@/lib/restaurant-hours";
import { sendPush } from "@/lib/push/sendPush";
import {
  getCommissionAmount,
  getRestaurantAmount,
  getCommissionConfig,
  getOrderTotal,
} from "@/lib/configuration/pricing";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);


function generateTrackingCode() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let code = "WOF-";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  return code;
}

export async function POST(request: Request) {
console.log(
    "SUPABASE URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL
  );

  console.log(
    "SERVICE KEY:",
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
  );

console.log(
  "SERVICE KEY:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

  try {
    const body = await request.json();
console.log(
  "BODY RECIBIDO:",
  body
);

console.log(
  "RESTAURANT ID:",
  body.restaurant_id
);
    const trackingCode =
      generateTrackingCode();

    const {
restaurant_id,

push_subscription_id,

customer_name,
customer_phone,
customer_email,

delivery_address,
delivery_sector,

notes,
delivery_instructions,

  payment_method,
  payment_confirmed,
  selected_qr_id,
  selected_qr_name,
  payment_proof_url,

  cash_amount,
  change_amount,

  order_type,
  subtotal,
  delivery_fee,
  total,
  terms_accepted,
  items,
} = body;


console.log("restaurant_id:", restaurant_id);
const { data: restaurant } =
  await supabase
    .from("restaurants")
    .select(`
      commission_active,
      commission_type,
      commission_percentage
    `)
    .eq("id", restaurant_id)
    .maybeSingle();

const commissionConfig =
  getCommissionConfig(
    restaurant
  );

/*
subtotal que llega del checkout:

- customer:
  YA incluye comisión.

- restaurant:
  Es precio base.
*/

const percentage =
  Number(
    commissionConfig.commission_percentage
  ) || 0;

const baseSubtotal =
  commissionConfig.commission_active &&
  commissionConfig.commission_type ===
    "customer"
    ? Number(
        (
          subtotal /
          (1 + percentage / 100)
        ).toFixed(2)
      )
    : subtotal;

const commission_amount =
  getCommissionAmount(
    baseSubtotal,
    commissionConfig
  );

const restaurant_amount =
  getRestaurantAmount(
    baseSubtotal,
    commissionConfig
  );

const wolf_amount =
  commission_amount;

const final_total =
  getOrderTotal(
    subtotal,
    delivery_fee
  );

    // Validaciones básicas

    if (!restaurant_id) {
      return NextResponse.json(
        {
          success: false,
          error: "restaurant_id requerido",
        },
        { status: 400 }
      );
    }

const {
  data: schedule,
  error: scheduleError,
} = await supabase
  .from("schedule_settings")
  .select("*")
  .eq(
    "restaurant_id",
    restaurant_id
  )
  .order(
    "created_at",
    {
      ascending: false,
    }
  )
  .limit(1)
  .maybeSingle();

console.log(
  "SCHEDULE ERROR:",
  scheduleError
);

console.log(
  "SCHEDULE:",
  schedule
);

console.log(
  "IS OPEN:",
  isRestaurantOpen(
    schedule
  )
);

if (
  schedule &&
  !isRestaurantOpen(
    schedule
  )
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "El restaurante está cerrado en este momento",
    },
    {
      status: 400,
    }
  );
} 

    if (!customer_name) {
      return NextResponse.json(
        {
          success: false,
          error: "customer_name requerido",
        },
        { status: 400 }
      );
    }

    
if (!customer_phone) {
  return NextResponse.json(
    {
      success: false,
      error: "customer_phone requerido",
    },
    {
      status: 400,
    }
  );
}

if (
  !items ||
  !Array.isArray(items) ||
  items.length === 0
) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Debe existir al menos un producto",
    },
    {
      status: 400,
    }
  );
}


    // Crear pedido

    console.log(
  "PUSH SUBSCRIPTION:",
  push_subscription_id
);

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({

  restaurant_id,

  push_subscription_id,

  customer_name,
  customer_phone,
  customer_email,

  delivery_address,
  delivery_sector,

  notes,
  delivery_instructions,

  payment_method,
  payment_confirmed,

  selected_qr_id,
  selected_qr_name,

  payment_proof_url,

  cash_amount,
  change_amount,

  payment_status: "pending",

  order_type,

subtotal,

delivery_fee,

total:
  final_total,

  commission_amount,
  restaurant_amount,
  wolf_amount,

  tracking_code: trackingCode,

  status: "pending",

  terms_accepted,
  terms_accepted_at:
    new Date().toISOString(),
})
        .select()
        .maybeSingle();

        console.log(
  "ORDER ERROR:",
  orderError
);

if (orderError) {

  console.log(
    JSON.stringify(
      orderError,
      null,
      2
    )
  );

  return NextResponse.json(
    {
      success: false,
      error: orderError.message,
      details: orderError,
    },
    {
      status: 500,
    }
  );
}

    // Guardar productos

    if (
      items &&
      Array.isArray(items) &&
      items.length > 0
    ) {

 console.log("ITEMS RECIBIDOS:", items);

      const orderItems =
     
        items.map((item: any) => ({
          order_id: order.id,

          product_id:
            item.product_id,

          quantity:
            item.quantity,

          unit_price:
            item.price,

          subtotal:
            item.price *
            item.quantity,
        }));

      const {
        error: itemsError,
      } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error(itemsError);

        return NextResponse.json(
          {
            success: false,
            error:
              itemsError.message,
          },
          {
            status: 500,
          }
        );
      }
    }

    // Guardar aceptación legal

    if (terms_accepted) {
      await supabase
        .from("legal_acceptances")
        .insert({
          order_id: order.id,

          accepted_terms: true,

          accepted_privacy_policy:
            true,

          accepted_at:
            new Date().toISOString(),

          ip_address:
            request.headers.get(
              "x-forwarded-for"
            ) || null,

          user_agent:
            request.headers.get(
              "user-agent"
            ) || null,
        });
    }

try {
  await sendPush({
    restaurant_id,

    title: "🛍️ Nuevo pedido",

    body: `${customer_name} realizó un pedido por $${final_total.toFixed(2)}`,

    url: `/admin/orders/${order.id}`,
  });
} catch (err) {
  console.error(
    "Error enviando Push",
    err
  );
}


    return NextResponse.json({
      success: true,
      orderId: order.id,
      trackingCode,
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