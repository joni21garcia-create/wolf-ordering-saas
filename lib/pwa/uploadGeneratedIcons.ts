import { createClient } from "@supabase/supabase-js";

import {
  GeneratedIcon,
} from "@/lib/image/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UploadedIcon {
  name: string;
  filename: string;
  url: string;
}

export async function uploadGeneratedIcons(
  restaurantId: string,
  icons: GeneratedIcon[]
): Promise<UploadedIcon[]> {

  const uploaded: UploadedIcon[] = [];

  for (const icon of icons) {

    const path =
      `${restaurantId}/${icon.filename}`;

    const { error } =
      await supabase.storage

        .from("restaurant-pwa")

        .upload(
          path,
          icon.buffer,
          {
            contentType: "image/png",
            upsert: true,
          }
        );

    if (error) {
      throw error;
    }

    const {
      data,
    } = supabase.storage

      .from("restaurant-pwa")

      .getPublicUrl(path);

    uploaded.push({
      name: icon.name,
      filename: icon.filename,
      url: data.publicUrl,
    });

  }

  return uploaded;

}