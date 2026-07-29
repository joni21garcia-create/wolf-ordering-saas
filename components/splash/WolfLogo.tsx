"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function WolfLogo() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center">

      {/* Halo exterior */}
      <div
        className={`
          absolute
          -z-20
          h-[340px]
          w-[340px]
          rounded-full
          transition-all
          duration-1000
          animate-halo-breath
          ${
            ready
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }
        `}
        style={{
          background:
            "radial-gradient(circle, rgba(249,115,22,.22) 0%, rgba(249,115,22,.08) 40%, transparent 72%)",
          filter: "blur(50px)",
        }}
      />

      {/* Halo interior */}
      <div
        className={`
          absolute
          -z-10
          h-[220px]
          w-[220px]
          rounded-full
          transition-all
          duration-1000
          animate-halo-breath-slow
          ${
            ready
              ? "opacity-100"
              : "opacity-0"
          }
        `}
        style={{
          background:
            "radial-gradient(circle, rgba(251,146,60,.22) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* Logo */}
      <div
        className={`
          relative
          transition-all
          duration-1000
          ease-out
          ${
            ready
              ? "opacity-100 scale-100"
              : "opacity-0 scale-90"
          }
        `}
      >
        <Image
          src="/branding/wolf-logo.png"
          alt="Wolf Ordering"
          width={245}
          height={245}
          priority
          className="
            select-none
            animate-logo-breath
            drop-shadow-[0_0_35px_rgba(249,115,22,.35)]
          "
        />

        {/* Ojo izquierdo */}
        <div
          className={`
            absolute
            left-[79px]
            top-[98px]
            transition-all
            duration-700
            ${
              ready
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }
          `}
        >
          <div
            className="
              h-5
              w-7
              rounded-full
            "
            style={{
              background:
                "radial-gradient(circle,#ffd18a 0%,#fb923c 35%,rgba(251,146,60,.25) 75%,transparent 100%)",
              filter: "blur(5px)",
              transform: "rotate(-12deg)",
              boxShadow:
                "0 0 28px rgba(249,115,22,.95)",
            }}
          />
        </div>

        {/* Ojo derecho */}
        <div
          className={`
            absolute
            right-[79px]
            top-[98px]
            transition-all
            duration-700
            ${
              ready
                ? "opacity-100 scale-100"
                : "opacity-0 scale-50"
            }
          `}
        >
          <div
            className="
              h-5
              w-7
              rounded-full
            "
            style={{
              background:
                "radial-gradient(circle,#ffd18a 0%,#fb923c 35%,rgba(251,146,60,.25) 75%,transparent 100%)",
              filter: "blur(5px)",
              transform: "rotate(12deg)",
              boxShadow:
                "0 0 28px rgba(249,115,22,.95)",
            }}
          />
        </div>

      </div>

    </div>
  );
}