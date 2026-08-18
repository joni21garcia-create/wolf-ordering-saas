import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API =
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PLAN_IDS = {
  basic: process.env.PAYPAL_PLAN_BASIC_ID,
  pro: process.env.PAYPAL_PLAN_PRO_ID,
} as const;

type Plan = "basic" | "pro";

async function getPayPalAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Faltan las credenciales de PayPal.");
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
    throw new Error("No se pudo autenticar con PayPal.");
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error("PayPal no devolvió un access token.");
  }

  return data.access_token as string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const subscriptionId =
      typeof body?.subscriptionId === "string"
        ? body.subscriptionId.trim()
        : "";

    const plan = body?.plan as Plan | undefined;

    if (!subscriptionId) {
      return NextResponse.json(
        {
          error: "Suscripción requerida",
          message:
            "No recibimos el identificador de la suscripción.",
        },
        { status: 400 },
      );
    }

    if (plan !== "basic" && plan !== "pro") {
      return NextResponse.json(
        {
          error: "Plan inválido",
          message: "El plan debe ser basic o pro.",
        },
        { status: 400 },
      );
    }

    const expectedPlanId = PLAN_IDS[plan];

    if (!expectedPlanId) {
      return NextResponse.json(
        {
          error: "Plan de PayPal no configurado",
          message:
            "El plan seleccionado no está configurado en PayPal.",
        },
        { status: 500 },
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_API}/v1/billing/subscriptions/${encodeURIComponent(
        subscriptionId,
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "[PAYPAL VERIFY SUBSCRIPTION ERROR]",
        data,
      );

      return NextResponse.json(
        {
          error: "No pudimos verificar la suscripción",
          message:
            data?.message ||
            "PayPal no permitió consultar la suscripción.",
        },
        { status: response.status },
      );
    }

    if (data?.id !== subscriptionId) {
      return NextResponse.json(
        {
          error: "Suscripción inconsistente",
          message:
            "La suscripción devuelta por PayPal no coincide.",
        },
        { status: 409 },
      );
    }

    if (data?.plan_id !== expectedPlanId) {
      return NextResponse.json(
        {
          error: "Plan inconsistente",
          message:
            "La suscripción de PayPal no corresponde al plan seleccionado.",
        },
        { status: 409 },
      );
    }

    const acceptedStatuses = ["ACTIVE", "APPROVED"];

    if (!acceptedStatuses.includes(data?.status)) {
      return NextResponse.json(
        {
          error: "Pago pendiente",
          message:
            `PayPal todavía no confirma la suscripción. Estado: ${
              data?.status || "desconocido"
            }.`,
          status: data?.status ?? null,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionId,
      plan,
      status: data.status,
      paypalPlanId: data.plan_id,
    });
  } catch (error) {
    console.error(
      "[PAYPAL VERIFY SUBSCRIPTION ERROR]",
      error,
    );

    return NextResponse.json(
      {
        error: "Error interno verificando PayPal",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      },
      { status: 500 },
    );
  }
}