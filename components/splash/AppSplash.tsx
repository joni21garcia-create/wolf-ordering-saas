"use client";

import { ReactNode, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

import SplashScene from "./SplashScene";
import { SPLASH_TIMING } from "./SplashAnimations";

interface Props {
  children: ReactNode;
}

export default function AppSplash({ children }: Props) {
  // En web no mostramos el splash.
  // En Android/iOS solo aparece al montar la app nativa.
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Mostrar el splash solo una vez por sesión de la app.
    // sessionStorage evita que aparezca al navegar o recargar una pantalla.
    const splashKey = "wolf-app-splash-shown";

    if (sessionStorage.getItem(splashKey) === "1") {
      return;
    }

    sessionStorage.setItem(splashKey, "1");

    setVisible(true);
    setFade(false);

    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, SPLASH_TIMING.FADE);

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, SPLASH_TIMING.HIDE);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <>
      {children}

      {visible && (
        <div
          className={`
            fixed
            inset-0
            z-[9999]
            transition-opacity
            duration-700
            ${
              fade
                ? "opacity-0 pointer-events-none"
                : "opacity-100"
            }
          `}
        >
          <SplashScene />
        </div>
      )}
    </>
  );
}