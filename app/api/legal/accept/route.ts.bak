import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateAgreementPdf } from "@/lib/legal/generateAgreementPdf";
import { sendAgreementEmail } from "@/lib/email/sendAgreementEmail";
import { randomUUID } from "crypto";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      acceptanceId,
      signatureName,
      signatureHash,
    } = body;

    if (!acceptanceId) {
      return NextResponse.json(
        {
          success: false,
          error: "acceptanceId requerido",
        },
        { status: 400 }
      );
    }

    const headersList = await headers();

    const ip =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      null;

    const userAgent =
      headersList.get("user-agent") ?? null;

    const {
      data: acceptance,
      error: acceptanceError,
    } = await supabaseAdmin
      .from("restaurant_legal_acceptance")
      .select("*")
      .eq("id", acceptanceId)
      .single();

    if (acceptanceError || !acceptance) {
      return NextResponse.json(
        {
          success: false,
          error: "Acuerdo no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const {
      error: updateError,
    } = await supabaseAdmin
      .from("restaurant_legal_acceptance")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
        signature_name: signatureName,
        signature_hash: signatureHash,
        ip_address: ip,
        user_agent: userAgent,
      })
      .eq("id", acceptanceId);

      
      if (updateError) {
  throw updateError;
}
    
const pdfBytes = await generateAgreementPdf({
  title: "Acuerdo Comercial Wolf Ordering",

  version: acceptance.accepted_version ?? "1.0.0",

  content:
    acceptance.accepted_content_snapshot!,

  ownerName:
    acceptance.owner_name ?? "",

  ownerEmail:
    acceptance.owner_email ?? "",

  restaurantName:
    acceptance.restaurant_id,

  acceptedAt:
    new Date().toISOString(),

  ip,

  userAgent,

  token:
    acceptance.token,
});

const fileName = `${randomUUID()}.pdf`;

const { error: uploadError } =
  await supabaseAdmin.storage
    .from("legal-agreements")
    .upload(fileName, pdfBytes, {
      contentType: "application/pdf",
      upsert: false,
    });

if (uploadError) {
  throw uploadError;
}

const { data: publicUrl } =
  supabaseAdmin.storage
    .from("legal-agreements")
    .getPublicUrl(fileName);

await supabaseAdmin
  .from("restaurant_legal_acceptance")
  .update({
    pdf_url: publicUrl.publicUrl,
  })
  .eq("id", acceptance.id);


  await sendAgreementEmail({
  ownerName:
    acceptance.owner_name ?? "",

  ownerEmail:
    acceptance.owner_email ?? "",

  restaurantName:
    acceptance.restaurant_id,

  agreementUrl:
    `${process.env.NEXT_PUBLIC_APP_URL}/legal/accept/${acceptance.token}`,

  pdfUrl:
    publicUrl.publicUrl,
});

const { error: eventError } =
  await supabaseAdmin
    .from("legal_events")
    .insert({
      acceptance_id: acceptance.id,

      event: "agreement_signed",

      description:
        "El propietario aceptó el acuerdo comercial.",

      performed_by:
        acceptance.owner_email,

      metadata: {
        ip,
        userAgent,
        owner: acceptance.owner_name,
        restaurant_id:
          acceptance.restaurant_id,
      },
    });

if (eventError) {
  throw eventError;
}
  
    if (eventError) {
      throw eventError;
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ??
          "Error interno",
      },
      {
        status: 500,
      }
    );
  }
}



