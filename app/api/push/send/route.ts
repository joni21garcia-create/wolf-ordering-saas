import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";
import { messaging } from "@/lib/firebase-admin";

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

    //
    // WEB PUSH
    //

    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("restaurant_id", restaurant_id);

    if (subscriptions?.length) {
      const payload = JSON.stringify({
        title,
        body,
        url,
      });

      await Promise.allSettled(
        subscriptions.map((item) =>
          webpush.sendNotification(
            item.subscription,
            payload
          )
        )
      );
    }

    //
    // ANDROID FCM
    //

    const { data: devices } = await supabase
      .from("device_tokens")
      .select("fcm_token")
      .eq("restaurant_id", restaurant_id)
      .eq("active", true);

    if (devices?.length) {
      await Promise.allSettled(
        devices.map((device) =>
          messaging.send({
            token: device.fcm_token,
            notification: {
              title,
              body,
            },
            data: {
              url: url ?? "",
            },
            android: {
              priority: "high",
            },
          })
        )
      );
    }

    return NextResponse.json({
      success: true,
      web: subscriptions?.length ?? 0,
      android: devices?.length ?? 0,
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