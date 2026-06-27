import { createClient } from "@supabase/supabase-js";

import { UploadedIcon } from "./uploadGeneratedIcons";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface UpdatePWAAssetsParams {
  restaurantId: string;
  appLogo: string;
  icons: UploadedIcon[];
}

export async function updatePWAAssets({
  restaurantId,
  appLogo,
  icons,
}: UpdatePWAAssetsParams) {
  const getUrl = (filename: string) =>
    icons.find(
      (icon) => icon.filename === filename
    )?.url ?? null;

  const { data, error } =
    await supabase
      .from("restaurant_pwa_settings")
      .update({
        app_logo: appLogo,

        favicon_url:
          getUrl("favicon.png"),

        icon_72_url:
          getUrl("icon-72.png"),

        icon_96_url:
          getUrl("icon-96.png"),

        icon_128_url:
          getUrl("icon-128.png"),

        icon_144_url:
          getUrl("icon-144.png"),

        icon_152_url:
          getUrl("icon-152.png"),

        icon_192_url:
          getUrl("icon-192.png"),

        icon_384_url:
          getUrl("icon-384.png"),

        icon_512_url:
          getUrl("icon-512.png"),

        apple_icon_url:
          getUrl(
            "apple-touch-icon.png"
          ),

        maskable_icon_url:
          getUrl(
            "maskable-icon.png"
          ),

        updated_at: new Date().toISOString(),
      })
      .eq(
        "restaurant_id",
        restaurantId
      )
      .select()
      .single();

  if (error) {
    throw error;
  }

  return data;
}