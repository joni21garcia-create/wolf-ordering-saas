import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

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

/**
 * GET /api/super-admin/restaurants/search?q=...
 *
 * Search endpoint used only by the Super Admin request-detail
 * association control. It never exposes the service-role key to
 * the browser.
 */
export async function GET(request: NextRequest) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return jsonError(
        "Configuración del servidor incompleta",
        "No está configurada la conexión con Supabase.",
        500,
      );
    }

    const accessToken = getBearerToken(request);

    if (!accessToken) {
      return jsonError(
        "No autenticado",
        "Necesitas una sesión activa para buscar restaurantes.",
        401,
      );
    }

    const supabase = getAdminClient();

    const {
      data: userData,
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !userData.user) {
      return jsonError(
        "Sesión inválida",
        "No pudimos verificar tu sesión.",
        401,
      );
    }

    const query = request.nextUrl.searchParams
      .get("q")
      ?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        restaurants: [],
      });
    }

    const escapedSearch = query
      .replace(/[%_]/g, "\\$&")
      .replace(/,/g, "\\,");

    let restaurantQuery = supabase
      .from("restaurants")
      .select("id, name, slug")
      .or(
        [
          `name.ilike.%${escapedSearch}%`,
          `slug.ilike.%${escapedSearch}%`,
        ].join(","),
      );

    // Solo consultamos por UUID cuando el texto realmente tiene formato UUID.
    // Nunca enviamos texto arbitrario a id.eq porque `restaurants.id` es UUID.
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        query,
      );

    if (isUuid) {
      restaurantQuery = supabase
        .from("restaurants")
        .select("id, name, slug")
        .or(
          [
            `name.ilike.%${escapedSearch}%`,
            `slug.ilike.%${escapedSearch}%`,
            `id.eq.${query}`,
          ].join(","),
        );
    }

    const { data, error } = await restaurantQuery
      .order("name", { ascending: true })
      .limit(10);

    if (error) {
      console.error(
        "[SUPER ADMIN RESTAURANT SEARCH] Error:",
        error,
      );

      return jsonError(
        "Error buscando restaurantes",
        error.message,
        500,
      );
    }

    return NextResponse.json({
      success: true,
      restaurants: data ?? [],
    });
  } catch (error) {
    console.error(
      "[SUPER ADMIN RESTAURANT SEARCH] Error inesperado:",
      error,
    );

    return jsonError(
      "Error interno",
      error instanceof Error
        ? error.message
        : "No pudimos buscar restaurantes.",
      500,
    );
  }
}