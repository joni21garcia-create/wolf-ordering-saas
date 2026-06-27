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

  return generateRestaurantMetadata(slug);
}

export default function RestaurantLayout({
  children,
}: Props) {
  return children;
}