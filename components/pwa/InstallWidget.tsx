"use client";

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { useInstall } from "./InstallProvider";

export default function InstallWidget() {
  const deferredPrompt = useInstall();

  if (!deferredPrompt) return null;

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        y: -2,
      }}
      whileTap={{
        scale: 0.96,
      }}
      onClick={() => deferredPrompt.prompt()}
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 9999,

        display: "flex",
        alignItems: "center",
        gap: 10,

        height: 52,
        padding: "0 18px",

        borderRadius: 999,
        border: "1px solid rgba(255,255,255,.08)",

        background:
          "rgba(20,20,20,.82)",

        backdropFilter: "blur(18px)",

        color: "#fff",

        cursor: "pointer",

        boxShadow:
          "0 10px 30px rgba(0,0,0,.35)",

        transition: ".25s ease",
      }}
    >
      <Smartphone
        size={20}
        strokeWidth={2.2}
      />

      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: ".2px",
        }}
      >
        App
      </span>
    </motion.button>
  );
}