import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";


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
          error: "No autorizado",
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
      .select("restaurant_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (restaurantError) {
      return NextResponse.json(
        {
          success: false,
          error: restaurantError.message,
        },
        {
          status: 500,
        }
      );
    }

    if (!restaurantUser) {
      return NextResponse.json(
        {
          success: false,
          error: "No pertenece a ningún restaurante",
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

    const { orderId, paymentStatus } =
      await request.json();

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

    if (!paymentStatus) {
      return NextResponse.json(
        {
          success: false,
          error: "paymentStatus requerido",
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
      "refunded",
    ];

    if (!validStatuses.includes(paymentStatus)) {
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
    VALIDAR PEDIDO
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
    UPDATE
    ==========================================================
    */

const {
  error: updateError,
} = await supabase
  .from("orders")
  .update({
    payment_status: paymentStatus,
    payment_confirmed:
      paymentStatus === "paid",
  })
  .eq("id", orderId)
  .eq(
    "restaurant_id",
    restaurantUser.restaurant_id
  );

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          error: updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
    ==========================================================
    RESPUESTA
    ==========================================================
    */

    return NextResponse.json({
      success: true,
      payment_status: paymentStatus,
      payment_confirmed:
        paymentStatus === "paid",
    });

  } catch (error) {

    console.error(
      "[UPDATE PAYMENT]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}