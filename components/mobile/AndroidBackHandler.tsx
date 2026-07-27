"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function AndroidBackHandler() {
  useEffect(() => {
    console.log("✅ AndroidBackHandler montado");

    let listener: { remove: () => Promise<void> } | undefined;

    const setup = async () => {
      listener = await App.addListener("backButton", ({ canGoBack }) => {
        console.log("🔙 Botón Atrás detectado", { canGoBack });

        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      });
    };

    setup();

    return () => {
      listener?.remove();
    };
  }, []);

  return null;
}