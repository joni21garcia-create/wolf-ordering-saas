import type { Metadata } from "next";

import { getRestaurant } from "@/lib/restaurants/getRestaurant";
import { getPWASettings } from "@/lib/pwa/getPWASettings";

export async function generateRestaurantMetadata(
  slug: string
): Promise<Metadata> {
  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    return {
      title: "Wolf Ordering",
      description: "Sistema de pedidos online.",
    };
  }

  const pwa =
    await getPWASettings(
      restaurant.id
    );

  const title =
    pwa?.app_name ||
    restaurant.name;

  const description =
    pwa?.description ||
    restaurant.description ||
    "Sistema de pedidos online.";

  const themeColor =
    pwa?.theme_color ||
    restaurant.primary_color ||
    "#f97316";

  const backgroundColor =
    pwa?.background_color ||
    restaurant.secondary_color ||
    "#111827";

const favicon =
  pwa?.favicon_url ||
  pwa?.app_logo ||
  restaurant.logo_url ||
  "/wolf-logo.png";

const appleIcon =
  pwa?.apple_icon_url ||
  pwa?.icon_192_url ||
  pwa?.app_logo ||
  restaurant.logo_url ||
  "/wolf-logo.png";

const appIcon =
  pwa?.icon_512_url ||
  pwa?.icon_192_url ||
  pwa?.app_logo ||
  restaurant.logo_url ||
  "/wolf-logo.png";

  return {
    title,

    description,

    applicationName: title,

    keywords: [
      "restaurante",
      "pedidos",
      "delivery",
      title,
    ],

    themeColor,

    manifest: `/api/manifest/${slug}`,

icons: {
  icon: favicon,

  shortcut: favicon,

  apple: [
    {
      url: appleIcon,
      sizes: "180x180",
      type: "image/png",
    },
  ],
},

    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title,
    },

    openGraph: {
      title,
      description,
      url: `/${slug}`,
      siteName: title,
      locale: "es_EC",
      type: "website",
images: [
  {
    url: appIcon,
    width: 512,
    height: 512,
    alt: title,
  },
],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [appIcon],
    },

    other: {
      "theme-color": themeColor,
      "background-color":
        backgroundColor,
    },
  };
}