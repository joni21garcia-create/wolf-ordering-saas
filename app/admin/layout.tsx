"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import RestaurantShell from "@/components/navigation/RestaurantShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Orders already owns its optimized Wolf navigation shell.
  // Do not nest a second sidebar there.
  if (pathname.startsWith("/admin/orders/")) {
    return <>{children}</>;
  }

  return <RestaurantShell>{children}</RestaurantShell>;
}