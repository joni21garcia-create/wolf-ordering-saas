import type { Metadata, Viewport } from "next";
import { generateRestaurantMetadata } from "./metadata";
import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseMetadata = await generateRestaurantMetadata(slug);

  return {
    ...baseMetadata,
    manifest: `/api/manifest/${slug}`,
  };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const { slug } = await params;
  const restaurant = await getRestaurantMetadata(slug);

  return {
    themeColor: restaurant?.pwaSettings?.theme_color || "#3b92a5",
    width: "device-width",
    initialScale: 1,
  };
}

export default function RestaurantLayout({ children }: Props) {
  return <>{children}</>;
}