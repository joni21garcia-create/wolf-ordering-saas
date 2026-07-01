import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

webpush.setVapidDetails(
  "mailto:admin@wolfordering.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const {
      restaurant_id,
      title,
      body,
      url,
    } = await req.json();

    const { data, error } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("restaurant_id", restaurant_id);

    if (error) throw error;

    if (!data?.length) {
      return NextResponse.json({
        success: true,
        message: "No existen suscripciones",
      });
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    const results = await Promise.allSettled(
      data.map((item) =>
        webpush.sendNotification(
          item.subscription,
          payload
        )
      )
    );

    console.log(results);

    return NextResponse.json({
      success: true,
      sent: results.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}