import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

import { getCurrentUser }
from "@/lib/auth/getCurrentUser";

import { checkPermission }
from "@/lib/auth/checkPermission";

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
      paymentStatus,
    } = body;

    const { data: order } =
  await supabase
    .from("orders")
    .select(`
      id,
      restaurant_id
    `)
    .eq(
      "id",
      orderId
    )
    .single();

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

    if (!paymentStatus) {
      return NextResponse.json(
        {
          success: false,
          error:
            "paymentStatus requerido",
        },
        {
          status: 400,
        }
      );
    }

    const validStatuses = [
      "pending",
      "paid",
      "refunded",
    ];

    if (
      !validStatuses.includes(
        paymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Estado de pago inválido",
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
          payment_status:
            paymentStatus,

          payment_confirmed:
            paymentStatus ===
            "paid",
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