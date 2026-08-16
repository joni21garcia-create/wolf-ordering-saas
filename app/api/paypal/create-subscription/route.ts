import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const PAYPAL_API =
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const PLAN_IDS = {
  basic: process.env.PAYPAL_PLAN_BASIC_ID,
  pro: process.env.PAYPAL_PLAN_PRO_ID,
} as const;

type Plan = "basic" | "pro";

async function getPayPalAccessToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Faltan las credenciales de PayPal",
    );
  }

  const credentials = Buffer.from(
    `${CLIENT_ID}:${CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "[PAYPAL TOKEN ERROR]",
      errorText,
    );

    throw new Error(
      "No se pudo autenticar con PayPal",
    );
  }

  const data = await response.json();

  return data.access_token as string;
}

export async function POST(
  request: NextRequest,
) {
  try {
    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error(
        "[PAYPAL] Faltan variables de Supabase",
      );

      return NextResponse.json(
        {
          error:
            "Configuración del servidor incompleta",
        },
        { status: 500 },
      );
    }

    // The customer must have an active Wolf session before
    // starting the PayPal checkout. We do not create a
    // restaurant-creation request at this stage.
    const authorization =
      request.headers.get("authorization");

    if (
      !authorization?.startsWith("Bearer ")
    ) {
      return NextResponse.json(
        {
          error: "No autenticado",
          message:
            "Necesitas una sesión activa para iniciar el pago.",
        },
        { status: 401 },
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "");

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (
      userError ||
      !userData.user
    ) {
      console.error(
        "[PAYPAL] Error verificando usuario:",
        userError,
      );

      return NextResponse.json(
        {
          error: "Sesión inválida",
          message:
            "No pudimos verificar tu sesión.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();
    const plan = body?.plan as Plan | undefined;

    if (
      plan !== "basic" &&
      plan !== "pro"
    ) {
      return NextResponse.json(
        {
          error: "Plan inválido",
          message:
            "El plan debe ser basic o pro.",
        },
        { status: 400 },
      );
    }

    const planId = PLAN_IDS[plan];

    if (!planId) {
      return NextResponse.json(
        {
          error:
            "Plan de PayPal no configurado",
          message:
            `Falta PAYPAL_PLAN_${
              plan === "basic"
                ? "BASIC"
                : "PRO"
            }_ID en .env.local`,
        },
        { status: 500 },
      );
    }

    const accessTokenPayPal =
      await getPayPalAccessToken();

    const origin = new URL(
      request.url,
    ).origin;

    // IMPORTANT:
    // PayPal checkout comes before the restaurant-creation request.
    // The request is created only after PayPal returns successfully
    // and the customer submits RestaurantInfoScreen.
    const response = await fetch(
      `${PAYPAL_API}/v1/billing/subscriptions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessTokenPayPal}`,
          "Content-Type":
            "application/json",
          Accept: "application/json",
          Prefer:
            "return=representation",
        },
        body: JSON.stringify({
          plan_id: planId,
          application_context: {
            brand_name: "Wolf Ordering",
            locale: "es-CO",
            shipping_preference:
              "NO_SHIPPING",
            user_action:
              "SUBSCRIBE_NOW",
            return_url:
              `${origin}/restaurant/onboarding` +
              `?paypal=success` +
              `&plan=${plan}`,
            cancel_url:
              `${origin}/restaurant/onboarding` +
              `?paypal=cancelled` +
              `&plan=${plan}`,
          },
        }),
      },
    );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "[PAYPAL CREATE SUBSCRIPTION ERROR]",
        data,
      );

      return NextResponse.json(
        {
          error:
            "PayPal no pudo crear la suscripción",
          details: data,
        },
        { status: response.status },
      );
    }

    const approveUrl =
      data.links?.find(
        (link: {
          rel?: string;
          href?: string;
        }) =>
          link.rel === "approve",
      )?.href;

    if (!approveUrl) {
      console.error(
        "[PAYPAL] No se encontró approve URL",
        data,
      );

      return NextResponse.json(
        {
          error:
            "PayPal no devolvió la URL de aprobación",
        },
        { status: 502 },
      );
    }

    if (!data.id) {
      console.error(
        "[PAYPAL] PayPal no devolvió subscription ID",
        data,
      );

      return NextResponse.json(
        {
          error:
            "PayPal no devolvió el ID de suscripción",
        },
        { status: 502 },
      );
    }

    const subscriptionStatus =
      data.status === "ACTIVE"
        ? "active"
        : "pending";

    console.log(
      "[PAYPAL] Suscripción creada para checkout",
      {
        userId: userData.user.id,
        plan,
        paypalPlanId: planId,
        subscriptionId: data.id,
        subscriptionStatus,
      },
    );

    return NextResponse.json({
      success: true,
      plan,
      paypalPlanId: planId,
      subscriptionId: data.id,
      subscriptionStatus,
      approveUrl,
    });
  } catch (error) {
    console.error(
      "[PAYPAL SUBSCRIPTION ERROR]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Error interno creando la suscripción",
      },
      { status: 500 },
    );
  }
}