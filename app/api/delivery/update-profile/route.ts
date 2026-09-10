import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Interfaz para validar los datos que envía la App
 */
interface UpdateProfileRequest {
  driverId: string;
  selfieUrl?: string;
  licensePlate?: string;
  vehicleColor?: string;
  vehicleType?: string;
  online?: boolean;
}

function bearer(request: NextRequest): string | null {
  const value = request.headers.get("authorization") ?? "";
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = bearer(request);
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
      return NextResponse.json({ success: false, error: "Sesión inválida." }, { status: 401 });
    }

    const body: UpdateProfileRequest = await request.json();
    const { driverId, ...updateData } = body;

    if (!driverId) {
      return NextResponse.json({ success: false, error: "driverId es requerido." }, { status: 400 });
    }

    // El driverId debe pertenecer al usuario autenticado
    const { data: driverRow } = await supabaseAdmin
      .from("delivery_drivers")
      .select("id")
      .eq("id", driverId)
      .eq("auth_user_id", userData.user.id)
      .maybeSingle();
    if (!driverRow) {
      return NextResponse.json({ success: false, error: "driverId no coincide con la sesión." }, { status: 403 });
    }

    // Limpiamos campos indefinidos para no sobreescribir con null por error
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    // Mapeo de nombres de campo de la App a la Base de Datos (snake_case)
    // Nota: los tipos generados de Supabase están desactualizados y no
    // incluyen columnas reales como selfie_url/license_plate, por eso 'any'.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbUpdate: any = {};
    if (cleanUpdateData.selfieUrl) dbUpdate.selfie_url = cleanUpdateData.selfieUrl;
    if (cleanUpdateData.licensePlate) dbUpdate.license_plate = cleanUpdateData.licensePlate;
    if (cleanUpdateData.vehicleColor) dbUpdate.vehicle_color = cleanUpdateData.vehicleColor;
    if (cleanUpdateData.vehicleType) dbUpdate.vehicle_type = cleanUpdateData.vehicleType;
    if (cleanUpdateData.online !== undefined) dbUpdate.online = cleanUpdateData.online;

    // Actualizar en Supabase usando la tabla delivery_drivers
    const { data, error } = await supabaseAdmin
      .from("delivery_drivers")
      .update(dbUpdate)
      .eq("id", driverId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[UPDATE_PROFILE][DB_ERROR]", error);
      return NextResponse.json({ success: false, error: "Error al actualizar en base de datos." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente.",
      driver: data
    });

  } catch (error) {
    console.error("[UPDATE_PROFILE][FATAL]", error);
    const message = error instanceof Error ? error.message : "desconocido";
    return NextResponse.json({ success: false, error: "Error interno: " + message }, { status: 500 });
  }
}