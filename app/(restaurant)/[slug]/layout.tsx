import type { Metadata } from "next";

import { generateRestaurantMetadata } from "./metadata";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  // 1. Obtenemos los metadatos base generados por tu función actual
  const baseMetadata = await generateRestaurantMetadata(slug);

  // 2. Retornamos los metadatos inyectando dinámicamente el manifest de tu API
  return {
    ...baseMetadata,
    manifest: `/api/pwa/manifest?slug=${slug}`, // 🌟 ¡LA PIEZA FALTANTE! Vincula el manifest dinámico con su slug
  };
}

export default function RestaurantLayout({
  children,
}: Props) {
  return <>{children}</>;
}