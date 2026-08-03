"use client";

import { useEffect, useRef } from "react";

import { Capacitor } from "@capacitor/core";

import { initializeAndroid } from "@/lib/push/initializeAndroid";
import { initializeCustomerAndroid } from "@/lib/push/initializeCustomerAndroid";
import { registerWeb } from "@/lib/push/registerWeb";

interface PushProviderProps {
  restaurantId?: string;
}

export default function PushProvider({
  restaurantId,
}: PushProviderProps) {

  const initialized = useRef(false);

useEffect(() => {

  if (initialized.current) return;

  initialized.current = true;

  async function initialize() {

    try {

      /*
      ==========================================================
      WEB / PWA
      ==========================================================
      */

if (!Capacitor.isNativePlatform()) {

  if (!restaurantId) {
    console.log(
      "[PUSH] WEB SIN RESTAURANT ID"
    );
    return;
  }

  console.log("=================================");
  console.log("[PUSH] MODO WEB");
  console.log("=================================");

  await registerWeb({
    restaurantId,
  });

  console.log(
    "[PUSH] WEB REGISTRADO"
  );

  return;

}

      /*
      ==========================================================
      ANDROID CLIENTE
      ==========================================================
      */

      if (restaurantId) {

        console.log("=================================");
        console.log("[PUSH] MODO CLIENTE");
        console.log("=================================");

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
      ANDROID ADMIN
      ==========================================================
      */

      console.log("=================================");
      console.log("[PUSH] MODO ADMINISTRADOR");
      console.log("=================================");

      await initializeAndroid();

      console.log(
        "[PUSH] ADMINISTRADOR ANDROID INICIALIZADO"
      );

    } catch (error) {

      console.error(
        "[PUSH PROVIDER]",
        error
      );

    }

  }

  initialize();

}, [restaurantId]);

  return null;

}