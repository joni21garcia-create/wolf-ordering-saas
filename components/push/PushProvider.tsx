"use client";

import { useEffect, useRef } from "react";

import { Capacitor } from "@capacitor/core";

import { initializeAndroid } from "@/lib/push/initializeAndroid";

interface PushProviderProps {
  restaurantId: string;
  userId?: string;
}

export default function PushProvider({
  restaurantId,
  userId,
}: PushProviderProps) {

  const initialized = useRef(false);

  useEffect(() => {

    if (initialized.current) return;

    if (!Capacitor.isNativePlatform()) return;

    initialized.current = true;

    async function initialize() {

      console.log("=================================");
      console.log("[PUSH PROVIDER]");
      console.log("Restaurant:", restaurantId);
      console.log("User:", userId ?? "CLIENT");
      console.log("=================================");

      /*
      ==========================================================
      ANDROID
      ==========================================================
      */

      try {

        await initializeAndroid({

          restaurantId,

          userId,

        });

        console.log(
          "[PUSH] ANDROID INICIALIZADO"
        );

      } catch (error) {

        console.error(
          "[PUSH] ANDROID ERROR",
          error
        );

      }

    }

    initialize();

  }, [restaurantId, userId]);

  return null;

}