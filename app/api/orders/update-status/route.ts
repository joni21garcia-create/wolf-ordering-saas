import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendCustomerPush } from "@/lib/push/sendCustomerPush";

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
        tracking_code
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

    switch (status) {
      case "accepted":
        title = "🍽️ Pedido confirmado";
        message =
          "El restaurante aceptó tu pedido.";
        break;

      case "preparing":
        title =
          "👨‍🍳 Preparando tu pedido";
        message =
          "Tu pedido ya está en preparación.";
        break;

      case "ready":
        title = "📦 Pedido listo";
        message =
          "Tu pedido está listo.";
        break;

      case "out_for_delivery":
        title = "🛵 En camino";
        message =
          "Tu pedido salió para entrega.";
        break;

      case "completed":
        title = "❤️ Pedido entregado";
        message =
          "Gracias por comprar con nosotros.";
        break;

      case "cancelled":
        title = "⚠ Pedido cancelado";
        message =
          "El restaurante canceló el pedido.";
        break;
    }

    if (title) {
      try {
        await sendCustomerPush({
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


