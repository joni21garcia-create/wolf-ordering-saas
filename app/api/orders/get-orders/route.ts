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

export async function GET() {
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
          error: "User not found",
        },
        {
          status: 401,
        }
      );
    }

const hasPermission =
  await checkPermission(
    authUser.auth_user_id,
    "orders"
  );

    if (!hasPermission) {
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

    const { data, error } =
      await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            unit_price,
            subtotal,
            products (
              id,
              name
            )
          )
        `)
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
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