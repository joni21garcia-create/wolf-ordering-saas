import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { sendCustomerPush } from "@/lib/push/sendCustomerPush";

import {
  CustomerOrderStatus,
} from "@/lib/push/customerMessages";

/*
|--------------------------------------------------------------------------
| Estados permitidos
|--------------------------------------------------------------------------
*/

const VALID_STATUSES: CustomerOrderStatus[] = [
  "accepted",
  "preparing",
  "ready",
  "on_the_way",
  "completed",
  "cancelled",
];

/*
|--------------------------------------------------------------------------
| POST
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {

    /*
    ==========================================================
    SUPABASE
    ==========================================================
    */

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
    } =
      await supabase.auth.getUser();

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
    RESTAURANTE DEL USUARIO
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

      .eq(
        "auth_user_id",
        user.id
      )

      .maybeSingle();

    if (
      restaurantError ||
      !restaurantUser
    ) {

      return NextResponse.json(
        {
          success: false,
          error:
            "Restaurant not assigned",
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

    const {
      orderId,
      status,
    }: {
      orderId: string;
      status: CustomerOrderStatus;
    } =
      await request.json();

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

    if (
      !VALID_STATUSES.includes(
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
        restaurant_id
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
          error:
            orderError.message,
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
          error:
            "Pedido no encontrado",
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

    const updateData: Record<
      string,
      unknown
    > = {

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
    ACTUALIZAR PEDIDO
    ==========================================================
    */

    const {
      error: updateError,
    } = await supabase

      .from("orders")

      .update(updateData)

      .eq(
        "id",
        orderId
      )

      .eq(
        "restaurant_id",
        restaurantUser.restaurant_id
      );

    if (updateError) {

      console.error(
        "[ORDER STATUS]",
        updateError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            updateError.message,
        },
        {
          status: 500,
        }
      );

    }

    /*
    ==========================================================
    NOTIFICACIÓN AL CLIENTE
    ==========================================================
    */

    try {

      await sendCustomerPush({

        orderId,

        status,

      });

    } catch (pushError) {

      console.error(
        "[CUSTOMER PUSH]",
        pushError
      );

    }

    /*
    ==========================================================
    RESPUESTA
    ==========================================================
    */
       return NextResponse.json({

      success: true,

      orderId,

      status,

      message:
        "Estado actualizado correctamente.",

    });

  } catch (error) {

    console.error(
      "[UPDATE ORDER STATUS]",
      error
    );

    return NextResponse.json(

      {

        success: false,

        error:
          "Error interno del servidor.",

      },

      {

        status: 500,

      }

    );

  }

}