"use client";

import { useEffect, useRef } from "react";

import { subscribeToPush } from "@/lib/pwa/subscribeToPush";

interface Props {
  restaurantId: string;
  userId: string;
}

export default function PushNotificationsProvider({
  restaurantId,
  userId,
}: Props) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (!restaurantId || !userId) return;

    initialized.current = true;

    (async () => {
      try {
        await subscribeToPush(
          restaurantId,
          userId
        );

        console.log(
          "[PUSH] Dispositivo registrado."
        );
      } catch (error) {
        console.error(
          "[PUSH]",
          error
        );
      }
    })();

  }, [restaurantId, userId]);

  return null;
}