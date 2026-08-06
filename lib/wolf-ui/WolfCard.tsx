"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export type WolfCardVariant =
  | "default"
  | "glass"
  | "ghost"
  | "outlined";

export type WolfCardPadding =
  | "none"
  | "sm"
  | "md"
  | "lg";

export interface WolfCardProps
  extends HTMLAttributes<HTMLDivElement> {

  children: ReactNode;

  variant?: WolfCardVariant;

  padding?: WolfCardPadding;

  hover?: boolean;

  glow?: boolean;

  clickable?: boolean;

}

const paddingMap: Record<
  WolfCardPadding,
  number
> = {

  none: 0,

  sm: 16,

  md: 24,

  lg: 32,

};

const variants: Record<
  WolfCardVariant,
  CSSProperties
> = {

  default: {

    background: "#121212",

    border:
      "1px solid rgba(255,255,255,.05)",

  },

  glass: {

    background:
      "rgba(255,255,255,.05)",

    backdropFilter:
      "blur(18px)",

    border:
      "1px solid rgba(255,255,255,.08)",

  },

  ghost: {

    background: "transparent",

  },

  outlined: {

    background: "#111111",

    border:
      "1px solid rgba(249,115,22,.22)",

  },

};

export default function WolfCard({

  children,

  variant = "default",

  padding = "md",

  hover = false,

  glow = false,

  clickable = false,

  style,

  ...props

}: WolfCardProps) {

  return (

    <div

      {...props}

      style={{

        ...variants[variant],

        padding: paddingMap[padding],

        borderRadius: 24,

        position: "relative",

        transition:
          "all .28s cubic-bezier(.22,.61,.36,1)",

        boxShadow: glow

          ? "0 0 40px rgba(249,115,22,.12)"

          : "none",

        cursor: clickable

          ? "pointer"

          : "default",

        userSelect: "none",

        ...(hover && {

          transform:
            "translateZ(0)",

        }),

        ...style,

      }}

      onMouseEnter={(e) => {

        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(-4px)";

        e.currentTarget.style.boxShadow = glow

          ? "0 20px 48px rgba(249,115,22,.18)"

          : "0 18px 40px rgba(0,0,0,.28)";

      }}

      onMouseLeave={(e) => {

        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.boxShadow = glow

          ? "0 0 40px rgba(249,115,22,.12)"

          : "none";

      }}

    >

      {children}

    </div>

  );

}