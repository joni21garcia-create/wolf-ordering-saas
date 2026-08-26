"use client";

import type { ReactNode } from "react";
import { useSession } from "@/providers/SessionProvider";
import RestaurantShell from "@/components/navigation/RestaurantShell";

export default function RestaurantContextLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { loading } = useSession();

  if (loading) return null;

  return <RestaurantShell>{children}</RestaurantShell>;
}
