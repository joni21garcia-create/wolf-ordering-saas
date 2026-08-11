import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendCustomer } from "@/lib/push";

export async function POST(request: NextRequest) {

  try {

    console.log("=================================");
    console.log("[UPDATE STATUS] INICIO");
    console.log("=================================");

    const supabase =
      await createSupabaseServerClient();

    /*
    ==========================================================
    USUARIO
    ==========================================================
    */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log(
      "[UPDATE STATUS] USER:",
      user?.id
    );

    if (authError || !user) {

      console.log(
        "[UPDATE STATUS] Usuario no autenticado"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );

    }

    /*
    ==========================================================
    RESTAURANTE
    ==========================================================
    */

    const {
      data: restaurantUser,
      error: restaurantError,
    } = await supabase
      .from("restaurant_users")
      .select(`
        restaurant_id,
        auth_user_id,
        role_id
      `)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    console.log(
      "[UPDATE STATUS] RESTAURANT:",
      restaurantUser?.restaurant_id
    );

    if (restaurantError || !restaurantUser) {

      console.log(
        "[UPDATE STATUS] Restaurante no encontrado"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Restaurant not assigned",
        },
        {
          status: 403,
        }
      );

    }

    /*
    ==========================================================
    BODY
    ==========================================================
    */

    const body = await request.json();

    console.log(
      "[UPDATE STATUS] BODY:",
      body
    );

    const {
      orderId,
      status,
    } = body;

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "orderId requerido",
        },
        {
          status: 400,
        }
      );
    }

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          error: "status requerido",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ==========================================================
    VALIDAR ESTADO
    ==========================================================
    */

    const validStatuses = [
      "pending",
      "paid",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Estado inválido",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ==========================================================
    PEDIDO
    ==========================================================
    */

const {
  data: order,
  error: orderError,
} = await supabase
  .from("orders")
  .select(`
    id,
    restaurant_id,
    tracking_code,
    order_type
  `)
      .eq("id", orderId)
      .eq(
        "restaurant_id",
        restaurantUser.restaurant_id
      )
      .maybeSingle();

    if (orderError) {
      return NextResponse.json(
        {
          success: false,
          error: orderError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Pedido no encontrado",
        },
        {
          status: 404,
        }
      );
    }

 /*
==========================================================
CAMPOS AUTOMÁTICOS
==========================================================
*/

console.log(
  "[UPDATE STATUS] Pedido encontrado:"
);

console.log({
  id: order.id,
  tracking_code: order.tracking_code,
  order_type: order.order_type,
  restaurant_id: order.restaurant_id,
});

const updateData: Record<string, unknown> = {
  payment_status: status,
};

console.log(
  "[UPDATE STATUS] UpdateData:",
  updateData
);

/*
==========================================================
UPDATE
==========================================================
*/

const {
  error: updateError,
} = await supabase
  .from("orders")
  .update(updateData)
  .eq("id", orderId)
  .eq(
    "restaurant_id",
    restaurantUser.restaurant_id
  );

if (updateError) {

  console.error(
    "[UPDATE STATUS] ERROR UPDATE:",
    updateError
  );

  return NextResponse.json(
    {
      success: false,
      error: updateError.message,
      details: updateError,
    },
    {
      status: 500,
    }
  );

}

console.log(
  "[UPDATE STATUS] Pedido actualizado correctamente."
);

console.log(
  "[UPDATE STATUS] order_type RAW:",
  JSON.stringify(order.order_type)
);

console.log(
  "[UPDATE STATUS] status:",
  status
);

/*
==========================================================
PUSH
==========================================================
*/

console.log("=================================");
console.log("[UPDATE STATUS] PUSH");
console.log("=================================");

const orderType = String(order.order_type)
  .replace(/"/g, "")
  .trim();

console.log(
  "[UPDATE STATUS] orderType NORMALIZADO:",
  orderType
);

let title = "";
let message = "";


let icon = "/icons/icon-192.png";

console.log(
  "[UPDATE STATUS] order_type:",
  JSON.stringify(order.order_type)
);

console.log(
  "[UPDATE STATUS] status:",
  status
);

/*
==========================================================
DELIVERY
==========================================================
*/

if (orderType === "delivery") {

  console.log("[UPDATE STATUS] DELIVERY");

  switch (status) {

 case "accepted":
  title = "👨‍🍳 Pedido aceptado";
  message = "El restaurante confirmó tu pedido.";
  icon = "/icons/push/accepted.png";
  break;

case "preparing":
  title = "🍳 En preparación";
  message = "Nuestro equipo ya está preparando tu pedido.";
  icon = "/icons/push/preparing.png";
  break;
   
case "ready":
  title = "📦 Pedido listo";
  message = "Tu pedido está listo y saldrá en unos momentos.";
  icon = "/icons/push/ready.png";
  break;
   
case "out_for_delivery":
  title = "🛵 ¡Va en camino!";
  message = "Tu pedido salió del restaurante y va rumbo a ti.";
  icon = "/icons/push/delivery.png";
  break;
   
case "completed":
  title = "🎉 ¡Pedido entregado!";
  message = "Esperamos que disfrutes tu comida. ¡Gracias por elegirnos!";
  icon = "/icons/push/completed.png";
  break;

 case "cancelled":
  title = "❌ Pedido cancelado";
  message = "El restaurante canceló tu pedido.";
  icon = "/icons/push/cancelled.png";
  break;


  }

}

/*
==========================================================
PICKUP
==========================================================
*/

else if (orderType === "pickup") {

  console.log("[UPDATE STATUS] PICKUP");

  switch (status) {

    case "accepted":
      title = "👨‍🍳 Pedido aceptado";
      message = "El restaurante confirmó tu pedido.";
      break;

    case "preparing":
      title = "🍳 En preparación";
      message = "Nuestro equipo ya está preparando tu pedido.";
      break;

    case "ready":
      title = "🥡 ¡Listo para recoger!";
      message = "Ya puedes pasar por tu pedido cuando gustes.";
      break;

    case "completed":
      title = "🥡 ¡Pedido retirado!";
      message = "Gracias por visitarnos. ¡Buen provecho!";
      break;

    case "cancelled":
      title = "❌ Pedido cancelado";
      message = "El restaurante canceló tu pedido.";
      break;

  }

}

/*
==========================================================
TABLE
==========================================================
*/

else if (orderType === "table") {

  console.log("[UPDATE STATUS] TABLE");

  switch (status) {

    case "accepted":
      title = "👨‍🍳 Pedido aceptado";
      message = "El restaurante comenzará a prepararlo.";
      break;

    case "preparing":
      title = "🍳 En preparación";
      message = "Estamos preparando tu pedido.";
      break;

    case "ready":
      title = "🍽️ ¡Pedido listo!";
      message = "En unos momentos será llevado a tu mesa.";
      break;

    case "completed":
      title = "🍽️ ¡Servido!";
      message = "Tu pedido fue entregado en la mesa. ¡Buen provecho!";
      break;

    case "cancelled":
      title = "❌ Pedido cancelado";
      message = "El restaurante canceló tu pedido.";
      break;

  }

}

console.log("[UPDATE STATUS] TITLE:", title);
console.log("[UPDATE STATUS] MESSAGE:", message);

if (!title) {

  console.warn(
    "[UPDATE STATUS] No se generó notificación."
  );

} else {

  console.log(
    "[UPDATE STATUS] Enviando push al cliente..."
  );

  try {

await sendCustomer({

  orderId,

  title,

  body: message,

  url: `/tracking/${order.tracking_code}`,

  icon,

  badge: "/icons/badge.png",

});

    console.log(
      "[UPDATE STATUS] Push enviado."
    );

  } catch (pushError) {

    console.error(
      "[UPDATE STATUS] Error sendCustomer:",
      pushError
    );

  }

}

    /*
    ==========================================================
    RESPUESTA
    ==========================================================
    */

    return NextResponse.json({
      success: true,
      status,
      paymentStatus: status,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}