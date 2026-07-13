import { supabase } from "@/lib/supabase/client";

interface CreateLegalAcceptanceParams {
  restaurantId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
}

export async function createLegalAcceptance({
  restaurantId,
  ownerName,
  ownerEmail,
  ownerPhone = "",
}: CreateLegalAcceptanceParams) {

  /*
  ============================================
  BUSCAR DOCUMENTO ACTIVO
  ============================================
  */

  const {
    data: document,
    error: documentError,
  } = await supabase
    .from("legal_documents")
    .select("*")
    .eq(
      "code",
      "restaurant_agreement"
    )
    .eq(
      "is_active",
      true
    )
    .single();

  if (documentError) {
    throw documentError;
  }

  /*
  ============================================
  CREAR ACEPTACIÓN
  ============================================
  */

  const {
    data: acceptance,
    error: acceptanceError,
  } = await supabase
    .from("restaurant_legal_acceptance")
    .insert({
      restaurant_id: restaurantId,

      legal_document_id:
        document.id,

      owner_name:
        ownerName,

      owner_email:
        ownerEmail,

      owner_phone:
        ownerPhone,

      accepted_version:
        document.version,

      accepted_content_snapshot:
        document.content,

      status:
        "pending",
    })
    .select()
    .single();

  if (acceptanceError) {
    throw acceptanceError;
  }

  /*
  ============================================
  PRIMER EVENTO
  ============================================
  */

  const {
    error: eventError,
  } = await supabase
    .from("legal_events")
    .insert({
      acceptance_id:
        acceptance.id,

      event:
        "agreement_created",

      description:
        "Acuerdo generado automáticamente.",

      performed_by:
        "system",

      metadata: {
        restaurant_id:
          restaurantId,
      },
    });

  if (eventError) {
    throw eventError;
  }

  return acceptance;
}