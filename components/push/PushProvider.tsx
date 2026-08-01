"use client";

import { useEffect, useRef } from "react";

import { Capacitor } from "@capacitor/core";

import { initializeAndroid } from "@/lib/push/initializeAndroid";
import { initializeCustomerAndroid } from "@/lib/push/initializeCustomerAndroid";

interface PushProviderProps {
  restaurantId?: string;
}

export default function PushProvider({
  restaurantId,
}: PushProviderProps) {

  const initialized = useRef(false);

  useEffect(() => {

    if (initialized.current) return;

    if (!Capacitor.isNativePlatform()) return;

    initialized.current = true;

    async function initialize() {

      console.log("=================================");
      console.log("[PUSH PROVIDER]");
      console.log("Inicializando Android...");
      console.log("=================================");

      try {

        /*
        ==========================================================
        CLIENTE
        ==========================================================
        */

        if (restaurantId) {

          console.log(
            "[PUSH] MODO CLIENTE"
          );

          await initializeCustomerAndroid({

            restaurantId,

          });

          console.log(
            "[PUSH] CLIENTE ANDROID INICIALIZADO"
          );

          return;

        }

        /*
        ==========================================================
        ADMINISTRADOR
        ==========================================================
        */

        console.log(
          "[PUSH] MODO ADMINISTRADOR"
        );

        await initializeAndroid();

        console.log(
          "[PUSH] ADMINISTRADOR ANDROID INICIALIZADO"
        );

      } catch (error) {

        console.error(
          "[PUSH] ANDROID ERROR",
          error
        );

      }

    }

    initialize();

  }, [restaurantId]);

  return null;

}