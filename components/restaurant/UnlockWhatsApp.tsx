"use client";

import { useEffect } from "react";

interface Props {
  restaurantId: string;
}

export default function UnlockWhatsApp({
  restaurantId,
}: Props) {
  useEffect(() => {
    if (!restaurantId) return;

    localStorage.setItem(
      `wolf_whatsapp_${restaurantId}`,
      "true"
    );

    console.log(
      "✅ WhatsApp desbloqueado:",
      restaurantId
    );
  }, [restaurantId]);

  return null;
}