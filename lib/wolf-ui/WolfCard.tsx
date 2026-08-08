"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfColors,
  WolfRadius,
  WolfShadows,
  WolfSpacing,
  WolfTransitions,
} from "@/lib/wolf-ui/core";

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

  sm: WolfSpacing.lg,

  md: WolfSpacing["2xl"],

  lg: WolfSpacing["3xl"],
};

const variants: Record<
  WolfCardVariant,
  CSSProperties
> = {
  default: {
    background: WolfColors.surface,

    border: `1px solid ${WolfColors.border}`,
  },

  glass: {
    background: "rgba(255,255,255,.05)",

    backdropFilter: "blur(18px)",

    border: `1px solid ${WolfColors.borderStrong}`,
  },

  ghost: {
    background: "transparent",
  },

  outlined: {
    background: WolfColors.surface,

    border: `1px solid ${WolfColors.primarySoft}`,
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

        borderRadius: WolfRadius["2xl"],

        position: "relative",

        transition: WolfTransitions.default,

        boxShadow: glow
          ? WolfShadows.glowOrange
          : WolfShadows.none,

        cursor: clickable
          ? "pointer"
          : "default",

        userSelect: "none",

        willChange:
          hover ? "transform, box-shadow" : undefined,

        ...style,
      }}
      onMouseEnter={(e) => {
        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(-4px)";

        e.currentTarget.style.boxShadow = glow
          ? WolfShadows.glowOrange
          : WolfShadows.lg;
      }}
      onMouseLeave={(e) => {
        if (!hover) return;

        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.boxShadow = glow
          ? WolfShadows.glowOrange
          : WolfShadows.none;
      }}
    >
      {children}
    </div>
  );
}