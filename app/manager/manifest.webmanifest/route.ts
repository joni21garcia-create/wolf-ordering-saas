import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("manager_pwa_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      throw error;
    }

    return NextResponse.json(
      {
        name: data.app_name,

        short_name: data.short_name,

        description: data.description,

        start_url: "/manager",

        scope: "/manager",

        display: data.display,

        orientation: data.orientation,

        theme_color: data.theme_color,

        background_color: data.background_color,

        icons: [
          {
            src: data.icon_72_url || data.app_logo,
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: data.icon_96_url || data.app_logo,
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: data.icon_128_url || data.app_logo,
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: data.icon_144_url || data.app_logo,
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: data.icon_152_url || data.app_logo,
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: data.icon_192_url || data.app_logo,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: data.icon_384_url || data.app_logo,
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: data.icon_512_url || data.app_logo,
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: data.maskable_icon_url || data.app_logo,
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/manifest+json",
        },
      }
    );
  } catch (error) {
    console.error("MANIFEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "No fue posible generar el manifest.",
      },
      {
        status: 500,
      }
    );
  }
}