"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";

export default function AndroidBackHandler() {
  useEffect(() => {
    console.log("✅ AndroidBackHandler montado");

    const setup = async () => {
      const listener = await App.addListener("backButton", (event) => {
        console.log("🔙 Botón Atrás detectado", event);
      });

      return listener;
    };

    let listener: Awaited<ReturnType<typeof App.addListener>>;

    setup().then((l) => {
      listener = l;
    });

    return () => {
      listener?.remove();
    };
  }, []);

  return null;
}