import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE ||
  "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const PLAN_VALUES = ["basic", "pro"] as const;
type Plan = (typeof PLAN_VALUES)[number];

type CreateRequestBody = {
  restaurant_name?: unknown;
  owner_name?: unknown;
  owner_email?: unknown;
  owner_phone?: unknown;
  plan?: unknown;
  paypal_subscription_id?: unknown;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlan(value: unknown): value is Plan {
  return (
    typeof value === "string" &&
    PLAN_VALUES.includes(value as Plan)
  );
}

function jsonError(error: string, message: string, status: number) {
  return NextResponse.json({ error, message }, { status });
}

async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error(
      "Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET",
    );
  }

  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/oauth2/token`,
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

    throw new Error(
      `PayPal OAuth error ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();

  if (!data?.access_token) {
    throw new Error(
      "PayPal no devolvió un access token.",
    );
  }

  return data.access_token as string;
}

type PayPalSubscriptionStatus =
  | "ACTIVE"
  | "APPROVAL_PENDING"
  | "APPROVED"
  | "SUSPENDED"
  | "CANCELLED"
  | "EXPIRED"
  | string;

type PayPalSubscriptionResponse = {
  id?: string;
  plan_id?: string;
  status?: PayPalSubscriptionStatus;
};

async function getPayPalSubscription(
  subscriptionId: string,
): Promise<PayPalSubscriptionResponse> {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/billing/subscriptions/${encodeURIComponent(
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

  const data =
    (await response.json()) as PayPalSubscriptionResponse & {
      message?: string;
      error?: string;
    };

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `PayPal devolvió ${response.status} al consultar la suscripción.`,
    );
  }

  return data;
}

function mapPayPalSubscriptionStatus(status?: string) {
  switch (status) {
    case "ACTIVE":
      return {
        payment_status: "completed" as const,
        subscription_status: "active" as const,
      };

    case "SUSPENDED":
      return {
        payment_status: "pending" as const,
        subscription_status: "suspended" as const,
      };

    case "CANCELLED":
      return {
        payment_status: "cancelled" as const,
        subscription_status: "cancelled" as const,
      };

    case "EXPIRED":
      return {
        payment_status: "pending" as const,
        subscription_status: "expired" as const,
      };

    default:
      return {
        payment_status: "pending" as const,
        subscription_status: "pending" as const,
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Faltan variables de Supabase",
      );

      return jsonError(
        "Configuración del servidor incompleta",
        "No está configurada la conexión con Supabase.",
        500,
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return jsonError(
        "No autenticado",
        "Necesitas una sesión activa para crear una solicitud.",
        401,
      );
    }

    const accessToken = authorization.slice("Bearer ".length).trim();

    if (!accessToken) {
      return jsonError(
        "No autenticado",
        "Necesitas una sesión activa para crear una solicitud.",
        401,
      );
    }

    const body = (await request.json()) as CreateRequestBody;

    const restaurantName = cleanString(body.restaurant_name);
    const ownerName = cleanString(body.owner_name);
    const ownerEmail = cleanString(body.owner_email).toLowerCase();
    const ownerPhone = cleanString(body.owner_phone);
    const plan = body.plan;
    const paypalSubscriptionId = cleanString(body.paypal_subscription_id);

    if (restaurantName.length < 2) {
      return jsonError(
        "Nombre de restaurante inválido",
        "El nombre del restaurante debe tener al menos 2 caracteres.",
        400,
      );
    }

    if (ownerName.length < 2) {
      return jsonError(
        "Nombre del propietario inválido",
        "El nombre del propietario debe tener al menos 2 caracteres.",
        400,
      );
    }

    if (!ownerEmail || !/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      return jsonError(
        "Correo electrónico inválido",
        "Introduce un correo electrónico válido.",
        400,
      );
    }

    if (ownerPhone.replace(/\D/g, "").length < 7) {
      return jsonError(
        "Teléfono inválido",
        "Introduce un número de teléfono válido.",
        400,
      );
    }

    if (!isPlan(plan)) {
      return jsonError(
        "Plan inválido",
        "El plan debe ser basic o pro.",
        400,
      );
    }

    if (!paypalSubscriptionId) {
      return jsonError(
        "Suscripción de PayPal requerida",
        "No recibimos el identificador de la suscripción de PayPal.",
        400,
      );
    }

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

    if (userError || !userData.user) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Error obteniendo usuario:",
        userError,
      );

      return jsonError(
        "Sesión inválida",
        "No pudimos verificar tu sesión.",
        401,
      );
    }

    const userId = userData.user.id;

    // Evita crear dos solicitudes para la misma suscripción si
    // el usuario vuelve a cargar la página o reenvía el formulario.
    const {
      data: existingRequest,
      error: existingRequestError,
    } = await supabase
      .from("restaurant_creation_requests")
      .select(
        "id, user_id, plan, request_status, payment_status, subscription_status, restaurant_id, paypal_subscription_id",
      )
      .eq("paypal_subscription_id", paypalSubscriptionId)
      .maybeSingle();

    if (existingRequestError) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Error comprobando solicitud existente:",
        existingRequestError,
      );

      return jsonError(
        "No pudimos comprobar la solicitud",
        existingRequestError.message,
        500,
      );
    }

    if (existingRequest) {
      if (existingRequest.plan !== plan) {
        return jsonError(
          "Plan inconsistente",
          "La suscripción de PayPal ya está asociada a otro plan.",
          409,
        );
      }

      if (existingRequest.user_id && existingRequest.user_id !== userId) {
        return jsonError(
          "Solicitud no disponible",
          "La suscripción de PayPal ya está asociada a otro usuario.",
          409,
        );
      }

      return NextResponse.json({
        success: true,
        requestId: existingRequest.id,
        plan: existingRequest.plan,
        status: {
          request: existingRequest.request_status,
          payment: existingRequest.payment_status,
          subscription: existingRequest.subscription_status,
        },
        restaurantId: existingRequest.restaurant_id,
        paypalSubscriptionId: existingRequest.paypal_subscription_id,
        existing: true,
      });
    }

    const {
      data: createdRequest,
      error: insertError,
    } = await supabase
      .from("restaurant_creation_requests")
      .insert({
        user_id: userId,
        restaurant_name: restaurantName,
        owner_name: ownerName,
        owner_email: ownerEmail,
        owner_phone: ownerPhone,
        plan,
        paypal_subscription_id: paypalSubscriptionId,
        payment_status: "pending",
        subscription_status: "pending",
        request_status: "pending",
        restaurant_id: null,
      })
      .select(
        "id, user_id, plan, request_status, payment_status, subscription_status, restaurant_id, paypal_subscription_id",
      )
      .single();

    if (insertError) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] Error creando solicitud:",
        insertError,
      );

      return jsonError(
        "No pudimos crear la solicitud del restaurante",
        insertError.message,
        500,
      );
    }

    console.log(
      "[RESTAURANT ACTIVATION REQUEST] Solicitud creada",
      {
        requestId: createdRequest.id,
        userId,
        plan: createdRequest.plan,
        paypalSubscriptionId: createdRequest.paypal_subscription_id,
      },
    );

    let finalRequest = createdRequest;

    try {
      const paypalSubscription =
        await getPayPalSubscription(
          paypalSubscriptionId,
        );

      console.log(
        "[RESTAURANT ACTIVATION REQUEST] Estado actual de PayPal",
        {
          subscriptionId:
            paypalSubscription.id,
          paypalPlanId:
            paypalSubscription.plan_id,
          status:
            paypalSubscription.status,
        },
      );

      if (
        paypalSubscription.id &&
        paypalSubscription.id !==
          paypalSubscriptionId
      ) {
        throw new Error(
          "PayPal devolvió un ID de suscripción diferente al solicitado.",
        );
      }

      const expectedPlanId = process.env[
        plan === "basic"
          ? "PAYPAL_PLAN_BASIC_ID"
          : "PAYPAL_PLAN_PRO_ID"
      ];

      if (
        expectedPlanId &&
        paypalSubscription.plan_id &&
        paypalSubscription.plan_id !==
          expectedPlanId
      ) {
        return jsonError(
          "Plan de PayPal inconsistente",
          "La suscripción de PayPal no corresponde al plan seleccionado.",
          409,
        );
      }

      const mappedStatus =
        mapPayPalSubscriptionStatus(
          paypalSubscription.status,
        );

      const { data: synchronizedRequest, error: syncError } =
        await supabase
          .from("restaurant_creation_requests")
          .update(mappedStatus)
          .eq("id", createdRequest.id)
          .select(
            "id, user_id, plan, request_status, payment_status, subscription_status, restaurant_id, paypal_subscription_id",
          )
          .single();

      if (syncError) {
        throw new Error(
          `No pudimos sincronizar el estado de la suscripción: ${syncError.message}`,
        );
      }

      finalRequest = synchronizedRequest;

      console.log(
        "[RESTAURANT ACTIVATION REQUEST] Solicitud sincronizada con PayPal",
        {
          requestId: finalRequest.id,
          paypalSubscriptionId:
            finalRequest.paypal_subscription_id,
          paymentStatus:
            finalRequest.payment_status,
          subscriptionStatus:
            finalRequest.subscription_status,
        },
      );
    } catch (paypalError) {
      console.error(
        "[RESTAURANT ACTIVATION REQUEST] No pudimos consultar/sincronizar PayPal después de crear la solicitud:",
        paypalError,
      );

      // La solicitud ya fue creada correctamente. El webhook puede
      // sincronizarla cuando llegue posteriormente.
    }

    return NextResponse.json({
      success: true,
      requestId: finalRequest.id,
      plan: finalRequest.plan,
      status: {
        request: finalRequest.request_status,
        payment: finalRequest.payment_status,
        subscription: finalRequest.subscription_status,
      },
      restaurantId: finalRequest.restaurant_id,
      paypalSubscriptionId:
        finalRequest.paypal_subscription_id,
      existing: false,
    });
  } catch (error) {
    console.error(
      "[RESTAURANT ACTIVATION REQUEST] Error inesperado:",
      error,
    );

    return NextResponse.json(
      {
        error: "Error interno creando la solicitud",
        message:
          error instanceof Error
            ? error.message
            : "Ocurrió un error inesperado.",
      },
      { status: 500 },
    );
  }
}