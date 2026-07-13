import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Params = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: Params
) {
  try {
    const { token } = await params;

    const {
      data: acceptance,
      error: acceptanceError,
    } = await supabaseAdmin
      .from("restaurant_legal_acceptance")
      .select("*")
      .eq("token", token)
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
      data: document,
      error: documentError,
    } = await supabaseAdmin
      .from("legal_documents")
      .select("*")
      .eq("id", acceptance.legal_document_id)
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        {
          success: false,
          error: "Documento no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      acceptance,
      document,
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