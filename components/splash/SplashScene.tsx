"use client";

import { useEffect, useState } from "react";

import BackgroundGlow from "./BackgroundGlow";
import EyeFlash from "./EyeFlash";
import FloatingParticles from "./FloatingParticles";
import LoadingDots from "./LoadingDots";
import WolfLogo from "./WolfLogo";

import { SPLASH_TIMING } from "./SplashAnimations";

export default function SplashScene() {
  const [eyesOn, setEyesOn] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const eyes = setTimeout(() => {
      setEyesOn(true);
    }, SPLASH_TIMING.EYES_ON);

    const title = setTimeout(() => {
      setShowTitle(true);
    }, 1100);

    const subtitle = setTimeout(() => {
      setShowSubtitle(true);
    }, 1350);

    const message = setTimeout(() => {
      setShowMessage(true);
    }, 1650);

    return () => {
      clearTimeout(eyes);
      clearTimeout(title);
      clearTimeout(subtitle);
      clearTimeout(message);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <BackgroundGlow />

      <FloatingParticles />

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-8 text-center">

        {/* Logo */}
        <div className="relative flex justify-center">
          <WolfLogo />

          <EyeFlash active={eyesOn} />
        </div>

        {/* Marca */}
        <div className="mt-10 flex flex-col items-center">

          <h1
            className={`
              text-5xl
              font-black
              tracking-[0.35em]
              text-white
              transition-all
              duration-700
              ease-out
              ${
                showTitle
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >
            WOLF
          </h1>

          <p
            className={`
              mt-3
              text-sm
              font-semibold
              uppercase
              tracking-[0.75em]
              text-orange-400
              transition-all
              duration-700
              ease-out
              ${
                showSubtitle
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              }
            `}
          >
            ORDERING
          </p>

        </div>

        {/* Mensaje */}
        <p
          className={`
            mt-12
            text-sm
            text-zinc-400
            transition-all
            duration-700
            ease-out
            ${
              showMessage
                ? "translate-y-0 opacity-100"
                : "translate-y-5 opacity-0"
            }
          `}
        >
          Preparando tu experiencia...
        </p>

        <div
          className={`
            mt-6
            transition-all
            duration-700
            ${
              showMessage
                ? "opacity-100"
                : "opacity-0"
            }
          `}
        >
          <LoadingDots />
        </div>

      </div>
    </div>
  );
}