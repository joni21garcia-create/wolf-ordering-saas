"use client";

import { useEffect, useRef } from "react";

import { Capacitor } from "@capacitor/core";

import { initializeAndroid } from "@/lib/push/initializeAndroid";

export default function PushProvider() {

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

        await initializeAndroid();

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

  }, []);

  return null;

}