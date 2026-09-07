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

export async function POST(request: NextRequest) {
  try {
    const body: UpdateProfileRequest = await request.json();
    const { driverId, ...updateData } = body;

    if (!driverId) {
      return NextResponse.json({ success: false, error: "driverId es requerido." }, { status: 400 });
    }

    // Limpiamos campos indefinidos para no sobreescribir con null por error
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, v]) => v !== undefined)
    );

    // Mapeo de nombres de campo de la App a la Base de Datos (snake_case)
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

  } catch (error: any) {
    console.error("[UPDATE_PROFILE][FATAL]", error);
    return NextResponse.json({ success: false, error: "Error interno: " + error.message }, { status: 500 });
  }
}