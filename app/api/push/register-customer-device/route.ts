import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  console.log("🔥 REGISTER CUSTOMER DEVICE");

  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    /*
    ==========================================================
    BODY
    ==========================================================
    */

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token FCM obligatorio",
        },
        {
          status: 400,
        }
      );
    }

    /*
    ==========================================================
    ¿YA EXISTE ESTE TOKEN?
    ==========================================================
    */

    const {
      data: existingSubscription,
      error: existingError,
    } = await supabase
      .from("push_subscriptions")
      .select("id")
      .eq("fcm_token", token)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return NextResponse.json(
        {
          success: false,
          error: existingError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
    ==========================================================
    UPDATE
    ==========================================================
    */

    if (existingSubscription) {
      const { error } = await supabase
        .from("push_subscriptions")
        .update({
          active: true,
          platform: "android",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSubscription.id);

      if (error) {
        console.error(error);

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

      console.log("🔥 UPDATE", existingSubscription.id);

      return NextResponse.json({
        success: true,
        push_subscription_id: existingSubscription.id,
      });
    }

    /*
    ==========================================================
    INSERT
    ==========================================================
    */

    const {
      data: newSubscription,
      error,
    } = await supabase
      .from("push_subscriptions")
      .insert({
        fcm_token: token,
        platform: "android",
        active: true,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);

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

    console.log("🔥 INSERT", newSubscription.id);

    /*
    ==========================================================
    RESPUESTA
    ==========================================================
    */

    return NextResponse.json({
      success: true,
      push_subscription_id: newSubscription.id,
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