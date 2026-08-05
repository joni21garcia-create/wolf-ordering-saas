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
  getFinalPrice,
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

  delivery_fee,

  terms_accepted,

  items,
 } = body;


/*
==========================================================
ORDER TYPE
==========================================================
*/

const normalizedOrderType = String(
  order_type ?? ""
)
  .replace(/"/g, "")
  .trim();

console.log(
  "[CREATE ORDER] order_type recibido:",
  order_type
);

console.log(
  "[CREATE ORDER] order_type normalizado:",
  normalizedOrderType
);


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

  const {
  data: deliverySettings,
} = await supabase
  .from("restaurant_delivery_settings")
  .select(`
    delivery_mode,
    delivery_fee,
    free_delivery_enabled,
    free_delivery_minimum
  `)
  .eq("restaurant_id", restaurant_id)
  .maybeSingle();

  const productIds = items.map(
  (item: any) => item.product_id
);

const {
  data: products,
  error: productsError,
} = await supabase
  .from("products")
  .select("id, name, price")
  .in("id", productIds);

if (productsError) {
  return NextResponse.json(
    {
      success: false,
      error:
        "No fue posible validar los productos.",
    },
    {
      status: 400,
    }
  );
}

if (!products || products.length !== productIds.length) {
  return NextResponse.json(
    {
      success: false,
      error: "Uno o más productos ya no existen.",
    },
    {
      status: 400,
    }
  );
}

/*
El subtotal siempre se recalcula desde los items.
Nunca confiamos en el valor enviado por el cliente.
*/

const subtotalCalculated = Number(
  items
    .reduce(
      (acc: number, item: any) => {

        const product = products?.find(
          (p) => p.id === item.product_id
        );

        const unitPrice = Number(
          product?.price ?? 0
        );

        return (
          acc +
          unitPrice *
            Number(item.quantity)
        );
      },
      0
    )
    .toFixed(2)
);


const commission_amount =
  getCommissionAmount(
    subtotalCalculated,
    commissionConfig
  );

const restaurant_amount =
  getRestaurantAmount(
    subtotalCalculated,
    commissionConfig
  );



const wolf_amount =
  commission_amount;

let deliveryFeeCalculated = 0;

if (deliverySettings) {

  if (deliverySettings.delivery_mode !== "manual") {

    deliveryFeeCalculated =
      Number(deliverySettings.delivery_fee) || 0;

    if (
      deliverySettings.free_delivery_enabled &&
      subtotalCalculated >=
        Number(deliverySettings.free_delivery_minimum)
    ) {
      deliveryFeeCalculated = 0;
    }
  }
}

const subtotalWithCommission =
  getFinalPrice(
    subtotalCalculated,
    commissionConfig
  );

console.log("CONFIG:", commissionConfig);

console.log("SUBTOTAL:", subtotalCalculated);

console.log(
  "SUBTOTAL CON COMISION:",
  subtotalWithCommission
);

console.log(
  "DELIVERY:",
  deliveryFeeCalculated
);

const final_total =
  getOrderTotal(
    subtotalWithCommission,
    deliveryFeeCalculated
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

for (const item of items) {
  if (
    !item.product_id ||
    Number(item.quantity) <= 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Cantidad de producto inválida.",
      },
      {
        status: 400,
      }
    );
  }
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

 order_type: normalizedOrderType,

subtotal: subtotalCalculated,

delivery_fee: deliveryFeeCalculated,

total: final_total,

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
  items.map((item: any) => {

    const product = products?.find(
      (p) => p.id === item.product_id
    );

    const unitPrice = Number(
      product?.price ?? 0
    );

    return {
      order_id: order.id,

      product_id: item.product_id,

      quantity: item.quantity,

      unit_price: Number(
        unitPrice.toFixed(2)
      ),

      subtotal: Number(
        (
          unitPrice * item.quantity
        ).toFixed(2)
      ),
    };
  });
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

/*
==========================================================
PUSH RESTAURANTE
==========================================================
*/

try {

  const productsText = items
    .map((item: any) => {

      const product = products?.find(
        (p) => p.id === item.product_id
      );

      return `• ${product?.name ?? "Producto"} x${item.quantity}`;

    })
    .join("\n");

  await sendPush({

    restaurant_id,

    title: `🔥 ${customer_name}`,

    body:
`Pedido ${trackingCode}

${productsText}

💰 Total: $${final_total.toFixed(2)}`,

    url: `/admin/orders/${restaurant_id}/orders/${order.id}`,

  });

} catch (err) {

  console.error(
    "[CREATE ORDER] Error enviando Push",
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


