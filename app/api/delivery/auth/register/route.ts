import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Interfaz temporal para evitar errores de TypeScript mientras
 * se actualizan los tipos globales de Supabase.
 */
interface DeliveryDriverInsert {
  auth_user_id: string;
  full_name: string;
  phone?: string;
  email: string;
  vehicle_type: string;
  license_plate: string;
  vehicle_color: string;
  selfie_url?: string;
  doc_front_url?: string;
  doc_back_url?: string;
  active: boolean;
  ranking_level: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extraemos los datos enviados por la App de Android
    const { 
      fullName, 
      email, 
      phone, 
      documentId, 
      vehicleType, 
      licensePlate, 
      vehicleColor,
      selfieUrl,
      docFrontUrl,
      docBackUrl 
    } = body;

    // Validación básica
    if (!email || !fullName || !documentId) {
      return NextResponse.json(
        { success: false, error: "Faltan datos obligatorios (email, nombre o documento)." },
        { status: 400 }
      );
    }

    // 1. Crear el usuario en Supabase Auth
    // Usamos admin para que la cuenta quede confirmada de inmediato
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: `Wolf${documentId}*`, // Generamos una clave temporal basada en su documento
      email_confirm: true,
      user_metadata: { 
        full_name: fullName,
        role: 'driver'
      }
    });

    if (authError || !authUser.user) {
      console.error("[REGISTER][AUTH_ERROR]", authError);
      return NextResponse.json(
        { success: false, error: "Error al crear las credenciales: " + authError?.message },
        { status: 500 }
      );
    }

    // 2. Insertar el perfil en la tabla delivery_drivers
    // Usamos el Cast 'as any' combinado con nuestra interfaz para saltar el bloqueo de tipos
    const { error: dbError } = await (supabaseAdmin
      .from("delivery_drivers") as any)
      .insert({
        auth_user_id: authUser.user.id,
        full_name: fullName,
        phone: phone,
        email: email.toLowerCase(),
        vehicle_type: vehicleType,
        license_plate: licensePlate,
        vehicle_color: vehicleColor,
        selfie_url: selfieUrl,
        doc_front_url: docFrontUrl,
        doc_back_url: docBackUrl,
        active: false, // Inactivo hasta revisión manual
        ranking_level: 'BRONCE'
      } as DeliveryDriverInsert);

    if (dbError) {
      console.error("[REGISTER][DB_ERROR]", dbError);
      // Limpieza: Si falla el perfil, borramos el usuario de auth para permitir re-intentos
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      
      return NextResponse.json(
        { success: false, error: "Error al guardar el perfil técnico: " + dbError.message },
        { status: 500 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: "Solicitud recibida. Tu perfil está en revisión.",
      userId: authUser.user.id
    });

  } catch (error: any) {
    console.error("[REGISTER][FATAL]", error);
    return NextResponse.json(
      { success: false, error: "Error interno: " + error.message },
      { status: 500 }
    );
  }
}