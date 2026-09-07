import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json();
    if (!orderId || !status) {
        return NextResponse.json({ success: false, error: "Faltan parámetros" }, { status: 400 });
    }

    const updateData: any = { status };
    if (status === "out_for_delivery") {
      updateData.out_for_delivery_at = new Date().toISOString();
    } else if (status === "completed") {
      updateData.completed_at = new Date().toISOString();
      updateData.payment_status = "paid";
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) throw error;

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}