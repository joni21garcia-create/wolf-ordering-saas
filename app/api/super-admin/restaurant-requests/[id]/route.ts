import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const REQUEST_SELECT = `
  id,
  user_id,
  restaurant_name,
  owner_name,
  owner_email,
  owner_phone,
  plan,
  paypal_plan_id,
  paypal_subscription_id,
  payment_status,
  subscription_status,
  request_status,
  restaurant_id,
  created_at,
  updated_at
`;

function jsonError(
  error: string,
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status },
  );
}

function getAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Faltan las variables de entorno de Supabase.",
    );
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

function getBearerToken(request: NextRequest) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization
    .slice("Bearer ".length)
    .trim();

  return token || null;
}

async function authenticate(request: NextRequest) {
  const accessToken = getBearerToken(request);

  if (!accessToken) {
    return {
      supabase: null,
      user: null,
      response: jsonError(
        "No autenticado",
        "Necesitas una sesión activa para continuar.",
        401,
      ),
    };
  }

  const supabase = getAdminClient();

  const {
    data: userData,
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !userData.user) {
    console.error(
      "[SUPER ADMIN REQUEST] Error verificando usuario:",
      userError,
    );

    return {
      supabase: null,
      user: null,
      response: jsonError(
        "Sesión inválida",
        "No pudimos verificar tu sesión.",
        401,
      ),
    };
  }

  return {
    supabase,
    user: userData.user,
    response: null,
  };
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * GET /api/super-admin/restaurant-requests/[id]
 *
 * Returns one restaurant creation request.
 */
export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonError(
        "Configuración del servidor incompleta",
        "No está configurada la conexión con Supabase.",
        500,
      );
    }

    const auth = await authenticate(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!id?.trim()) {
      return jsonError(
        "Solicitud inválida",
        "Falta el identificador de la solicitud.",
        400,
      );
    }

    const {
      data,
      error,
    } = await auth.supabase!
      .from("restaurant_creation_requests")
      .select(REQUEST_SELECT)
      .eq("id", id.trim())
      .maybeSingle();

    if (error) {
      console.error(
        "[SUPER ADMIN REQUEST] Error consultando solicitud:",
        error,
      );

      return jsonError(
        "Error consultando solicitud",
        error.message,
        500,
      );
    }

    if (!data) {
      return jsonError(
        "Solicitud no encontrada",
        "No existe una solicitud con ese identificador.",
        404,
      );
    }

    return NextResponse.json({
      success: true,
      request: data,
    });
  } catch (error) {
    console.error(
      "[SUPER ADMIN REQUEST] Error inesperado:",
      error,
    );

    return jsonError(
      "Error interno",
      error instanceof Error
        ? error.message
        : "No pudimos cargar la solicitud.",
      500,
    );
  }
}

/**
 * PATCH /api/super-admin/restaurant-requests/[id]
 *
 * Links the request to the restaurant created by the
 * existing seven-step SuperAdmin flow.
 *
 * Body:
 * {
 *   "restaurant_id": "uuid"
 * }
 *
 * restaurant_id starts as NULL after the customer's request
 * is created. Once the SuperAdmin creates the restaurant,
 * this endpoint stores the generated restaurant.id here.
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonError(
        "Configuración del servidor incompleta",
        "No está configurada la conexión con Supabase.",
        500,
      );
    }

    const auth = await authenticate(request);

    if (auth.response) {
      return auth.response;
    }

    const { id } = await context.params;

    if (!id?.trim()) {
      return jsonError(
        "Solicitud inválida",
        "Falta el identificador de la solicitud.",
        400,
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError(
        "JSON inválido",
        "El cuerpo de la solicitud no contiene JSON válido.",
        400,
      );
    }

    const restaurantId =
      typeof body === "object" &&
      body !== null &&
      "restaurant_id" in body &&
      typeof body.restaurant_id === "string"
        ? body.restaurant_id.trim()
        : "";

    if (!restaurantId) {
      return jsonError(
        "Restaurante requerido",
        "Debes enviar restaurant_id.",
        400,
      );
    }

    // Verify that the restaurant really exists before linking it.
    const {
      data: restaurant,
      error: restaurantError,
    } = await auth.supabase!
      .from("restaurants")
      .select("id, name")
      .eq("id", restaurantId)
      .maybeSingle();

    if (restaurantError) {
      console.error(
        "[SUPER ADMIN REQUEST] Error verificando restaurante:",
        restaurantError,
      );

      return jsonError(
        "Error verificando restaurante",
        restaurantError.message,
        500,
      );
    }

    if (!restaurant) {
      return jsonError(
        "Restaurante no encontrado",
        "El restaurant_id indicado no existe.",
        404,
      );
    }

    // Read the request first so we never silently overwrite an
    // already-linked request with a different restaurant.
    const {
      data: existingRequest,
      error: requestError,
    } = await auth.supabase!
      .from("restaurant_creation_requests")
      .select(
        "id, restaurant_id, paypal_subscription_id, request_status",
      )
      .eq("id", id.trim())
      .maybeSingle();

    if (requestError) {
      console.error(
        "[SUPER ADMIN REQUEST] Error leyendo solicitud:",
        requestError,
      );

      return jsonError(
        "Error consultando solicitud",
        requestError.message,
        500,
      );
    }

    if (!existingRequest) {
      return jsonError(
        "Solicitud no encontrada",
        "No existe una solicitud con ese identificador.",
        404,
      );
    }

    if (
      existingRequest.restaurant_id &&
      existingRequest.restaurant_id !== restaurantId
    ) {
      return jsonError(
        "Solicitud ya vinculada",
        "Esta solicitud ya está vinculada a otro restaurante.",
        409,
      );
    }

    const {
      data: updatedRequest,
      error: updateError,
    } = await auth.supabase!
      .from("restaurant_creation_requests")
      .update({
        restaurant_id: restaurantId,
      })
      .eq("id", id.trim())
      .select(REQUEST_SELECT)
      .single();

    if (updateError) {
      console.error(
        "[SUPER ADMIN REQUEST] Error vinculando restaurante:",
        updateError,
      );

      return jsonError(
        "No pudimos vincular el restaurante",
        updateError.message,
        500,
      );
    }

    console.log(
      "[SUPER ADMIN REQUEST] Restaurante vinculado",
      {
        requestId: updatedRequest.id,
        restaurantId,
        paypalSubscriptionId:
          updatedRequest.paypal_subscription_id,
      },
    );

    return NextResponse.json({
      success: true,
      message:
        "El restaurante quedó vinculado a la solicitud.",
      request: updatedRequest,
      restaurant,
    });
  } catch (error) {
    console.error(
      "[SUPER ADMIN REQUEST] Error inesperado:",
      error,
    );

    return jsonError(
      "Error interno",
      error instanceof Error
        ? error.message
        : "No pudimos vincular el restaurante.",
      500,
    );
  }
}