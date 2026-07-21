"use client";

import { useEffect, useRef } from "react";
import { subscribeToPush } from "@/lib/pwa/subscribeToPush";

interface Props {
  restaurantId: string;
}

export default function ClientPushProvider({
  restaurantId,
}: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (!restaurantId) return;

    initialized.current = true;

  (async () => {

  try {

    await subscribeToPush(
      restaurantId
    );

    console.log(
      "[CLIENT PUSH] Dispositivo registrado."
    );

  } catch (error) {

    console.error(
      "[CLIENT PUSH]",
      error
    );

  }

})();

  }, [restaurantId]);

  return null;
}


