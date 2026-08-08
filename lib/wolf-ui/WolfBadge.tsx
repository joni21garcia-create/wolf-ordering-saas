"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfColors,
  WolfRadius,
  WolfSpacing,
  WolfTypography,
  WolfTransitions,
} from "@/lib/wolf-ui/core";

export type WolfBadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "orange";

export type WolfBadgeSize =
  | "sm"
  | "md"
  | "lg";

export interface WolfBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;

  variant?: WolfBadgeVariant;

  size?: WolfBadgeSize;

  rounded?: boolean;
}

const variants: Record<
  WolfBadgeVariant,
  CSSProperties
> = {
  default: {
    background: WolfColors.surfaceLight,

    color: WolfColors.text,
  },

  primary: {
    background: WolfColors.primarySoft,

    color: WolfColors.primary,
  },

  success: {
    background: WolfColors.successSoft,

    color: WolfColors.success,
  },

  warning: {
    background: WolfColors.warningSoft,

    color: WolfColors.warning,
  },

  danger: {
    background: WolfColors.dangerSoft,

    color: WolfColors.danger,
  },

  info: {
    background: WolfColors.infoSoft,

    color: WolfColors.info,
  },

  orange: {
    background: WolfColors.primarySoft,

    color: WolfColors.primary,
  },
};

const sizes = {
  sm: {
    height: 24,

    padding: `0 ${WolfSpacing.sm}px`,

    fontSize: WolfTypography.size.xs,
  },

  md: {
    height: 30,

    padding: `0 ${WolfSpacing.md}px`,

    fontSize: WolfTypography.size.sm,
  },

  lg: {
    height: 36,

    padding: `0 ${WolfSpacing.lg}px`,

    fontSize: WolfTypography.size.md,
  },
};

export default function WolfBadge({
  children,

  variant = "default",

  size = "md",

  rounded = true,

  style,

  ...props
}: WolfBadgeProps) {
  return (
    <span
      {...props}
      style={{
        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: WolfSpacing.xs,

        height: sizes[size].height,

        padding: sizes[size].padding,

        borderRadius: rounded
          ? WolfRadius.round
          : WolfRadius.lg,

        fontFamily:
          WolfTypography.fontFamily,

        fontSize:
          sizes[size].fontSize,

        fontWeight:
          WolfTypography.weight.bold,

        lineHeight:
          WolfTypography.lineHeight.tight,

        whiteSpace: "nowrap",

        userSelect: "none",

        transition:
          WolfTransitions.default,

        ...variants[variant],

        ...style,
      }}
    >
      {children}
    </span>
  );
}