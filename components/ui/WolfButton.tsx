"use client";

import { motion } from "framer-motion";
import type {
  CSSProperties,
  ReactNode,
} from "react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "info";

interface WolfButtonProps {
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: CSSProperties;
  type?: "button" | "submit" | "reset";
}

const variants: Record<Variant, string> = {
  primary:
    "linear-gradient(180deg,#fb923c,#ea580c)",

  secondary:
    "linear-gradient(180deg,#343b49,#1d222c)",

  success:
    "linear-gradient(180deg,#22c55e,#15803d)",

  danger:
    "linear-gradient(180deg,#ef4444,#b91c1c)",

  info:
    "linear-gradient(180deg,#3b82f6,#1d4ed8)",
};

export default function WolfButton({
  children,
  onClick,
  fullWidth = false,
  disabled = false,
  variant = "secondary",
  style,
  type = "button",
}: WolfButtonProps) {

  return (

    <motion.button

      type={type}

      disabled={disabled}

      onClick={onClick}

      whileHover={{
        y: -1,
        scale: 1.02,
      }}

      whileTap={{
        y: 1,
        scale: 0.98,
      }}

      transition={{
        duration: 0.12,
        ease: "easeOut",
      }}

      style={{

        width:
          fullWidth
            ? "100%"
            : undefined,

        padding: "12px 18px",

        borderRadius: 14,

        border:
          "1px solid rgba(255,255,255,.08)",

        background:
          variants[variant],

        color: "#fff",

        fontWeight: 700,

        fontSize: 14,

        cursor:
          disabled
            ? "not-allowed"
            : "pointer",

        opacity:
          disabled
            ? .6
            : 1,

        boxShadow:
          "0 10px 24px rgba(0,0,0,.32)",

        userSelect: "none",

        ...style,

      }}

    >

      {children}

    </motion.button>

  );

}