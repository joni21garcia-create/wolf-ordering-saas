import type { Metadata } from "next";

import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";

export async function generateRestaurantMetadata(
  slug: string
): Promise<Metadata> {
  const restaurant =
    await getRestaurantMetadata(slug);

  if (!restaurant) {
    return {
      title: "Restaurante no encontrado | Wolf Ordering",
      description:
        "Este restaurante no existe.",
    };
  }

  return {
    title:
      restaurant.meta_title ??
      restaurant.pwaSettings?.app_name ??
      restaurant.name,

    description:
      restaurant.meta_description ??
      restaurant.pwaSettings?.description ??
      restaurant.description ??
      "",

    manifest: `/api/manifest/${slug}`,

    icons: {
    icon: `/api/favicon/${slug}`,
    shortcut: `/api/favicon/${slug}`,
    apple: `/api/favicon/${slug}`,
  },

    // 🛠️ FIX: Forzar al navegador a aceptar las credenciales y cookies del manifest dinámico
    other: {
      "crossorigin": "use-credentials",
    },

    openGraph: {
      title:
        restaurant.meta_title ??
        restaurant.pwaSettings?.app_name ??
        restaurant.name,

      description:
        restaurant.meta_description ??
        restaurant.pwaSettings?.description ??
        restaurant.description ??
        "",

      images: restaurant.og_image_url
        ? [
            {
              url: restaurant.og_image_url,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",

      title:
        restaurant.meta_title ??
        restaurant.pwaSettings?.app_name ??
        restaurant.name,

      description:
        restaurant.meta_description ??
        restaurant.pwaSettings?.description ??
        restaurant.description ??
        "",

      images: restaurant.og_image_url
        ? [restaurant.og_image_url]
        : [],
    },
  };
}