"use client";

import Link from "next/link";

export default function BackToSettings({
  restaurantId,
}: {
  restaurantId: string;
}) {
  return (
    <Link
      href={`/super-admin/restaurants/${restaurantId}/settings`}
      style={{
        color: "#f97316",
        textDecoration: "none",
        fontWeight: "700",
      }}
    >
      ← Volver a Configuración
    </Link>
  );
}