import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendCustomer } from "@/lib/push";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    /*
    ==========================================================
    USUARIO
    ==========================================================
    */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
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

    if (restaurantError || !restaurantUser) {
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

    const { orderId, status } = body;

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
      "accepted",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
      "cancelled",
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

     const updateData: Record<string, unknown> = {
  status,
};

    switch (status) {
      case "accepted":
        updateData.accepted_at =
          new Date().toISOString();
        break;

      case "preparing":
        updateData.preparing_at =
          new Date().toISOString();
        break;

      case "ready":
        updateData.ready_at =
          new Date().toISOString();
        break;

      case "completed":
        updateData.completed_at =
          new Date().toISOString();
        break;
    }

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
    "UPDATE STATUS ERROR:",
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

    /*
    ==========================================================
    PUSH
    ==========================================================
    */

    
    

let title = "";
let message = "";

if (order.order_type === "delivery") {

  switch (status) {

    case "accepted":
      title = "👨‍🍳 Pedido aceptado";
      message =
        "El restaurante confirmó tu pedido.";
      break;

    case "preparing":
      title = "🍳 En preparación";
      message =
        "Nuestro equipo ya está preparando tu pedido.";
      break;

    case "ready":
      title = "📦 Pedido listo";
      message =
        "Tu pedido está listo y saldrá en unos momentos.";
      break;

    case "out_for_delivery":
      title = "🛵 ¡Va en camino!";
      message =
        "Tu pedido salió del restaurante y va rumbo a ti.";
      break;

    case "completed":
      title = "🎉 ¡Pedido entregado!";
      message =
        "Esperamos que disfrutes tu comida. ¡Gracias por elegirnos!";
      break;

    case "cancelled":
      title = "❌ Pedido cancelado";
      message =
        "El restaurante canceló tu pedido.";
      break;

  }

} else if (order.order_type === "pickup") {

  switch (status) {

    case "accepted":
      title = "👨‍🍳 Pedido aceptado";
      message =
        "El restaurante confirmó tu pedido.";
      break;

    case "preparing":
      title = "🍳 En preparación";
      message =
        "Nuestro equipo ya está preparando tu pedido.";
      break;

    case "ready":
      title = "🥡 ¡Listo para recoger!";
      message =
        "Ya puedes pasar por tu pedido cuando gustes.";
      break;

    case "completed":
      title = "🥡 ¡Pedido retirado!";
      message =
        "Gracias por visitarnos. ¡Buen provecho!";
      break;

    case "cancelled":
      title = "❌ Pedido cancelado";
      message =
        "El restaurante canceló tu pedido.";
      break;

  }

} else if (order.order_type === "table") {

  switch (status) {

    case "accepted":
      title = "👨‍🍳 Pedido aceptado";
      message =
        "El restaurante comenzará a prepararlo.";
      break;

    case "preparing":
      title = "🍳 En preparación";
      message =
        "Estamos preparando tu pedido.";
      break;

    case "ready":
      title = "🍽️ ¡Pedido listo!";
      message =
        "En unos momentos será llevado a tu mesa.";
      break;

    case "completed":
      title = "🍽️ ¡Servido!";
      message =
        "Tu pedido fue entregado en la mesa. ¡Buen provecho!";
      break;

    case "cancelled":
      title = "❌ Pedido cancelado";
      message =
        "El restaurante canceló tu pedido.";
      break;

  }

}

    if (title) {
      try {
        await sendCustomer({
orderId,
  title,
  body: message,
  url: `/tracking/${order.tracking_code}`,
});
      } catch (pushError) {
        console.error(
          "Error enviando push:",
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



