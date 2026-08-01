import { NextRequest, NextResponse } from "next/server";

import { registerCustomerAndroidServer } from "@/lib/push/registerCustomerAndroidServer";

export async function POST(request: NextRequest) {
  try {
    const {
      restaurant_id,
      token,
      platform = "android",
    } = await request.json();

    if (!restaurant_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Restaurant ID requerido",
        },
        {
          status: 400,
        }
      );
    }

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token requerido",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await registerCustomerAndroidServer({
        restaurantId: restaurant_id,
        token,
        platform,
      });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      subscription_id: result.subscriptionId,
    });

  } catch (error) {

    console.error(
      "[REGISTER CUSTOMER DEVICE]",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}