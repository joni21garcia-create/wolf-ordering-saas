import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization
    .slice("Bearer ".length)
    .trim();

  return token || null;
}

/**
 * GET /api/super-admin/restaurant-requests
 *
 * Query params:
 * - search: restaurant, owner, email, phone or PayPal subscription
 * - status: request_status
 * - plan: basic | pro
 * - limit: default 50, max 100
 * - offset: default 0
 */
export async function GET(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error(
        "[SUPER ADMIN REQUESTS] Faltan variables de Supabase",
      );

      return jsonError(
        "Configuración del servidor incompleta",
        "No está configurada la conexión con Supabase.",
        500,
      );
    }

    const adminClient = getAdminClient();

    /*
     * Autenticación:
     * 1. Preferimos el Bearer token enviado por el panel.
     * 2. Si no existe, usamos la sesión SSR almacenada en cookies.
     *
     * Esto mantiene la API protegida y evita depender de que el cliente
     * haya hidratado la sesión exactamente en el mismo instante.
     */
    const accessToken = getBearerToken(request);

    let authenticatedUserId: string | null = null;

    if (accessToken) {
      const {
        data: userData,
        error: userError,
      } = await adminClient.auth.getUser(accessToken);

      if (!userError && userData.user) {
        authenticatedUserId = userData.user.id;
      } else {
        console.warn(
          "[SUPER ADMIN REQUESTS] Bearer inválido; intentando sesión SSR.",
          userError,
        );
      }
    }

    if (!authenticatedUserId) {
      const cookieResponse = NextResponse.next({
        request: {
          headers: request.headers,
        },
      });

      const serverSupabase = createServerClient(
        SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(
                ({ name, value, options }) => {
                  cookieResponse.cookies.set(
                    name,
                    value,
                    options,
                  );
                },
              );
            },
          },
        },
      );

      const {
        data: cookieUserData,
        error: cookieUserError,
      } = await serverSupabase.auth.getUser();

      if (!cookieUserError && cookieUserData.user) {
        authenticatedUserId = cookieUserData.user.id;
      }
    }

    if (!authenticatedUserId) {
      return jsonError(
        "No autenticado",
        "Necesitas una sesión activa para consultar las solicitudes.",
        401,
      );
    }

    const supabase = adminClient;

    const { searchParams } = new URL(request.url);

    const search = (
      searchParams.get("search") ?? ""
    ).trim();

    const status = (
      searchParams.get("status") ?? ""
    ).trim();

    const plan = (
      searchParams.get("plan") ?? ""
    ).trim();

    const rawLimit = Number(
      searchParams.get("limit") ?? "50",
    );

    const rawOffset = Number(
      searchParams.get("offset") ?? "0",
    );

    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.trunc(rawLimit), 1), 100)
      : 50;

    const offset = Number.isFinite(rawOffset)
      ? Math.max(Math.trunc(rawOffset), 0)
      : 0;

    let query = supabase
      .from("restaurant_creation_requests")
      .select(REQUEST_SELECT, {
        count: "exact",
      })
      .order("created_at", {
        ascending: false,
      })
      .range(
        offset,
        offset + limit - 1,
      );

    if (search) {
      const escapedSearch = search
        .replace(/[%_]/g, "\\$&")
        .replace(/,/g, "\\,");

      query = query.or(
        [
          `restaurant_name.ilike.%${escapedSearch}%`,
          `owner_name.ilike.%${escapedSearch}%`,
          `owner_email.ilike.%${escapedSearch}%`,
          `owner_phone.ilike.%${escapedSearch}%`,
          `paypal_subscription_id.ilike.%${escapedSearch}%`,
        ].join(","),
      );
    }

    if (status) {
      query = query.eq(
        "request_status",
        status,
      );
    }

    if (plan) {
      query = query.eq(
        "plan",
        plan,
      );
    }

    const {
      data,
      error,
      count,
    } = await query;

    if (error) {
      console.error(
        "[SUPER ADMIN REQUESTS] Error consultando solicitudes:",
        error,
      );

      return jsonError(
        "Error consultando solicitudes",
        error.message,
        500,
      );
    }

    const requests = data ?? [];
    const total = count ?? 0;

    return NextResponse.json({
      success: true,
      requests,
      total,
      pagination: {
        limit,
        offset,
        returned: requests.length,
        hasMore: offset + requests.length < total,
      },
      authenticatedUserId,
    });
  } catch (error) {
    console.error(
      "[SUPER ADMIN REQUESTS] Error inesperado:",
      error,
    );

    return jsonError(
      "Error interno",
      error instanceof Error
        ? error.message
        : "No pudimos cargar las solicitudes.",
      500,
    );
  }
}