import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const PAYPAL_API_BASE =
  process.env.PAYPAL_API_BASE || "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Obtiene un Access Token de PayPal.
 */
async function getPayPalAccessToken(): Promise<string> {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET");
  }

  const credentials = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `PayPal OAuth error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  return data.access_token;
}

/**
 * Verifica que el webhook realmente venga de PayPal.
 */
async function verifyPayPalWebhook(
  headers: Headers,
  webhookEvent: unknown
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID) {
    throw new Error("Falta PAYPAL_WEBHOOK_ID");
  }

  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");
  const transmissionSig = headers.get("paypal-transmission-sig");

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false;
  }

  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: authAlgo,
        transmission_sig: transmissionSig,
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: webhookEvent,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "PayPal webhook verification failed:",
      response.status,
      errorText
    );

    return false;
  }

  const result = await response.json();

  return result.verification_status === "SUCCESS";
}

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Faltan variables de Supabase");
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

async function updateCreationRequestBySubscription(
  subscriptionId: string,
  updates: {
    payment_status?: "pending" | "completed" | "failed" | "cancelled";
    subscription_status?:
      | "pending"
      | "active"
      | "suspended"
      | "cancelled"
      | "expired";
  },
) {
  if (!subscriptionId) {
    return {
      updated: false,
      reason: "missing_subscription_id",
    };
  }

  const supabase = getSupabaseAdmin();

  const {
    data: request,
    error: findError,
  } = await supabase
    .from("restaurant_creation_requests")
    .select(
      "id, paypal_subscription_id, payment_status, subscription_status, request_status, restaurant_id",
    )
    .eq("paypal_subscription_id", subscriptionId)
    .maybeSingle();

  if (findError) {
    throw new Error(
      `No pudimos buscar la solicitud de restaurante: ${findError.message}`,
    );
  }

  if (!request) {
    console.warn(
      "[PAYPAL WEBHOOK] No encontramos restaurant_creation_requests para la suscripción",
      subscriptionId,
    );

    console.warn(
      "[PAYPAL WEBHOOK] Supabase URL usada:",
      SUPABASE_URL,
    );

    return {
      updated: false,
      reason: "request_not_found",
    };
  }

  console.log(
    "[PAYPAL WEBHOOK] Solicitud encontrada antes del UPDATE:",
    request,
  );

  const { data: updatedRequest, error: updateError } =
    await supabase
      .from("restaurant_creation_requests")
      .update(updates)
      .eq("id", request.id)
      .select(
        "id, paypal_subscription_id, payment_status, subscription_status, request_status, restaurant_id",
      )
      .single();

  if (updateError) {
    throw new Error(
      `No pudimos actualizar la solicitud de restaurante: ${updateError.message}`,
    );
  }

  console.log(
    "[PAYPAL WEBHOOK] Resultado UPDATE:",
    updatedRequest,
  );

  console.log(
    "[PAYPAL WEBHOOK] Solicitud actualizada",
    {
      id: updatedRequest?.id,
      paypalSubscriptionId:
        updatedRequest?.paypal_subscription_id,
      paymentStatus:
        updatedRequest?.payment_status,
      subscriptionStatus:
        updatedRequest?.subscription_status,
      requestStatus:
        updatedRequest?.request_status,
      restaurantId:
        updatedRequest?.restaurant_id,
    },
  );

  return {
    updated: true,
    request: updatedRequest,
  };
}

/**
 * POST /api/paypal/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const webhookEvent = await request.json();

    console.log("======================================");
    console.log("PAYPAL WEBHOOK RECIBIDO");
    console.log("======================================");

    console.log("Event ID:", webhookEvent?.id);
    console.log("Event Type:", webhookEvent?.event_type);
    console.log("Create Time:", webhookEvent?.create_time);

    /**
     * Seguridad:
     *
     * Verificamos la firma directamente con PayPal.
     */
    const isValid = await verifyPayPalWebhook(
      request.headers,
      webhookEvent
    );

    if (!isValid) {
      console.error("❌ WEBHOOK PAYPAL NO VERIFICADO");

      return NextResponse.json(
        {
          success: false,
          error: "Invalid PayPal webhook signature",
        },
        {
          status: 401,
        }
      );
    }

    console.log("✅ WEBHOOK PAYPAL VERIFICADO");

    const eventType = webhookEvent?.event_type;

    /**
     * ==========================================
     * SUSCRIPCIÓN ACTIVADA
     * ==========================================
     */
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const resource = webhookEvent.resource;

      const subscriptionId =
        typeof resource?.id === "string"
          ? resource.id
          : "";

      console.log(
        "[PAYPAL WEBHOOK] Subscription ID recibido:",
        subscriptionId,
      );

      console.log(
        "[PAYPAL WEBHOOK] Supabase configurado:",
        Boolean(SUPABASE_URL),
        Boolean(SUPABASE_SERVICE_ROLE_KEY),
      );

      console.log("🟢 SUSCRIPCIÓN ACTIVADA");

      console.log({
        subscriptionId,
        planId: resource?.plan_id,
        subscriberEmail:
          resource?.subscriber?.email_address,
        payerId:
          resource?.subscriber?.payer_id,
        status: resource?.status,
      });

      await updateCreationRequestBySubscription(
        subscriptionId,
        {
          payment_status: "completed",
          subscription_status: "active",
        },
      );
    }

    /**
     * ==========================================
     * PAGO COMPLETADO
     * ==========================================
     */
    if (eventType === "PAYMENT.SALE.COMPLETED") {
      const resource = webhookEvent.resource;

      console.log("💰 PAGO PAYPAL COMPLETADO");

      console.log({
        saleId: resource?.id,
        amount: resource?.amount,
        state: resource?.state,
        billingAgreementId:
          resource?.billing_agreement_id,
      });

      const subscriptionId =
        typeof resource?.billing_agreement_id === "string"
          ? resource.billing_agreement_id
          : "";

      if (subscriptionId) {
        await updateCreationRequestBySubscription(
          subscriptionId,
          {
            payment_status: "completed",
          },
        );
      }
    }

    /**
     * ==========================================
     * PAGO FALLIDO
     * ==========================================
     */
    if (eventType === "BILLING.SUBSCRIPTION.PAYMENT.FAILED") {
      const resource = webhookEvent.resource;

      const subscriptionId =
        typeof resource?.id === "string"
          ? resource.id
          : "";

      console.log("🔴 PAGO DE SUSCRIPCIÓN FALLIDO");

      console.log({
        subscriptionId,
        status: resource?.status,
      });

      await updateCreationRequestBySubscription(
        subscriptionId,
        {
          payment_status: "failed",
        },
      );
    }

    /**
     * ==========================================
     * SUSCRIPCIÓN CANCELADA
     * ==========================================
     */
    if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      const resource = webhookEvent.resource;

      const subscriptionId =
        typeof resource?.id === "string"
          ? resource.id
          : "";

      console.log("🛑 SUSCRIPCIÓN CANCELADA");

      console.log({
        subscriptionId,
        status: resource?.status,
      });

      await updateCreationRequestBySubscription(
        subscriptionId,
        {
          payment_status: "cancelled",
          subscription_status: "cancelled",
        },
      );
    }

    /**
     * ==========================================
     * SUSCRIPCIÓN SUSPENDIDA
     * ==========================================
     */
    if (eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const resource = webhookEvent.resource;

      const subscriptionId =
        typeof resource?.id === "string"
          ? resource.id
          : "";

      console.log("⏸️ SUSCRIPCIÓN SUSPENDIDA");

      console.log({
        subscriptionId,
        status: resource?.status,
      });

      await updateCreationRequestBySubscription(
        subscriptionId,
        {
          subscription_status: "suspended",
        },
      );
    }

    /**
     * ==========================================
     * OTROS EVENTOS
     * ==========================================
     */

    console.log("Evento procesado:", eventType);

    return NextResponse.json({
      success: true,
      received: true,
      eventType,
      eventId: webhookEvent?.id,
    });
  } catch (error) {
    console.error("❌ ERROR PAYPAL WEBHOOK:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Webhook processing failed",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PayPal puede realizar comprobaciones GET.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Wolf Ordering PayPal Webhook",
    status: "online",
  });
}