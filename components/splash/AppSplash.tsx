"use client";

import { ReactNode, useEffect, useState } from "react";

import SplashScene from "./SplashScene";
import { SPLASH_TIMING } from "./SplashAnimations";

interface Props {
  children: ReactNode;
}

export default function AppSplash({ children }: Props) {
  const [visible, setVisible] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
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