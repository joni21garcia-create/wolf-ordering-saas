import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { acceptanceId } = body;

    if (!acceptanceId) {
      return NextResponse.json(
        {
          success: false,
          error: "acceptanceId requerido",
        },
        {
          status: 400,
        }
      );
    }

    const {
      data: acceptance,
      error,
    } = await supabaseAdmin
      .from("restaurant_legal_acceptance")
      .select("id, viewed_at")
      .eq("id", acceptanceId)
      .single();

    if (error || !acceptance) {
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

    if (!acceptance.viewed_at) {
      const { error: updateError } =
        await supabaseAdmin
          .from("restaurant_legal_acceptance")
          .update({
            viewed_at: new Date().toISOString(),
          })
          .eq("id", acceptanceId);

      if (updateError) {
        throw updateError;
      }
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