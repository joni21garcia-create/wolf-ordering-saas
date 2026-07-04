import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

import { getCurrentUser }
from "@/lib/auth/getCurrentUser";

import { checkPermission }
from "@/lib/auth/checkPermission";
import { sendCustomerPush }
from "@/lib/push/sendCustomerPush";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: Request
) {
  try {

    const headersList =
      await headers();

    const authorization =
      headersList.get(
        "authorization"
      );

    if (!authorization) {
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

    const token =
      authorization.replace(
        "Bearer ",
        ""
      );

    const authUser =
      await getCurrentUser(
        token
      );

    if (!authUser) {
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

    const canView =
      await checkPermission(
        authUser.auth_user_id,
        "orders"
      );

    if (!canView) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const body =
      await request.json();

    const {
      orderId,
      status,
    } = body;

    const { data: order } =
  await supabase
    .from("orders")
     .select(`
      id,
     restaurant_id,
     tracking_code
     `)
    .eq(
      "id",
      orderId
    )
    .maybeSingle();

if (!order) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Pedido no encontrado",
    },
    {
      status: 404,
    }
  );
}

if (
  order.restaurant_id !==
  authUser.restaurant_id
) {
  return NextResponse.json(
    {
      success: false,
      error: "Forbidden",
    },
    {
      status: 403,
    }
  );
}

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "orderId requerido",
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
          error:
            "status requerido",
        },
        {
          status: 400,
        }
      );
    }

    const validStatuses = [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
      "cancelled",
    ];

    if (
      !validStatuses.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Estado inválido",
        },
        {
          status: 400,
        }
      );
    }

    const { error } =
      await supabase
        .from("orders")
        .update({
          status,
        })
        .eq(
          "id",
          orderId
        );

        

    if (error) {
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

let title = "";
let message = "";

switch (status) {

  case "accepted":

    title = "🍽️ Pedido aceptado";

    message =
      "El restaurante aceptó tu pedido y comenzará a prepararlo.";

    break;

  case "preparing":

    title = "👨‍🍳 Preparando tu pedido";

    message =
      "Tu pedido ya está siendo preparado.";

    break;

  case "ready":

    title = "📦 Pedido listo";

    message =
      "Tu pedido está listo para ser retirado o entregado.";

    break;

  case "out_for_delivery":

    title = "🛵 Pedido en camino";

    message =
      "Tu pedido salió para entrega.";

    break;

  case "completed":

    title = "✅ Pedido entregado";

    message =
      "Gracias por ordenar con Wolf Ordering.";

    break;

  case "cancelled":

    title = "❌ Pedido cancelado";

    message =
      "El restaurante canceló tu pedido.";

    break;

}

if (title) {

  await sendCustomerPush({

    orderId,

    title,

    body: message,

    url: `/tracking/${order.tracking_code}`,

  });

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