import { NextResponse } from "next/server";
import { getPWASettings } from "@/lib/pwa/getPWASettings";
import { getRestaurant } from "@/lib/restaurants/getRestaurant";



export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  const { slug } = await params;

  //------------------------------------
  // Restaurante
  //------------------------------------

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    return NextResponse.json(
      {
        name: "Wolf Ordering",
        short_name: "Wolf",
      },
      {
        status: 404,
      }
    );
  }

  //------------------------------------
  // Configuración PWA
  //------------------------------------

const pwa = await getPWASettings(
  restaurant.id
);

  //------------------------------------
  // Manifest
  //------------------------------------

  return NextResponse.json(
    {
      id: `/${slug}`,

      name:
        pwa?.app_name ||
        restaurant.name,

      short_name:
        pwa?.short_name ||
        restaurant.name,

      description:
        pwa?.description ||
        restaurant.description ||
        "",

start_url: `/${slug}/`,
scope: `/${slug}/`,

      display:
        pwa?.display ||
        "standalone",

      orientation:
        pwa?.orientation ||
        "portrait",

      background_color:
        pwa?.background_color ||
        restaurant.secondary_color ||
        "#111827",

      theme_color:
        pwa?.theme_color ||
        restaurant.primary_color ||
        "#f97316",

      lang: "es",

      categories: [
        "food",
        "restaurant",
        "shopping",
      ],

icons: [
  {
    src:
      pwa?.icon_72_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "72x72",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_96_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "96x96",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_128_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "128x128",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_144_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "144x144",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_152_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "152x152",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_192_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_384_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "384x384",
    type: "image/png",
  },
  {
    src:
      pwa?.icon_512_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src:
      pwa?.maskable_icon_url ||
      pwa?.icon_512_url ||
      pwa?.app_logo ||
      restaurant.logo_url ||
      "/wolf-logo.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  }
],
    },
    {
      headers: {
        "Content-Type":
          "application/manifest+json",
      },
    }
  );
}