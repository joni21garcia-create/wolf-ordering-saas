import { NextRequest, NextResponse } from "next/server";

import { sendRestaurant } from "@/lib/push";

export async function POST(req: NextRequest) {

  try {

    const {

      restaurant_id,

      title,

      body,

      url,

    } = await req.json();

    await sendRestaurant({

      restaurantId: restaurant_id,

      title,

      body,

      url,

    });

    return NextResponse.json({

      success: true,

    });

  } catch (error) {

    console.error("[SEND PUSH]", error);

    return NextResponse.json(

      {

        success: false,

      },

      {

        status: 500,

      }

    );

  }

}