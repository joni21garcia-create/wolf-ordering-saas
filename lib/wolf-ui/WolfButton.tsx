"use client";

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

import {
  WolfColors,
  WolfRadius,
  WolfShadows,
  WolfSizes,
  WolfSpacing,
  WolfTypography,
  WolfTransitions,
} from "@/lib/wolf-ui/core";

export type WolfButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";

export type WolfButtonSize =
  | "sm"
  | "md"
  | "lg";

export interface WolfButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;

  variant?: WolfButtonVariant;

  size?: WolfButtonSize;

  loading?: boolean;

  fullWidth?: boolean;

  leftIcon?: ReactNode;

  rightIcon?: ReactNode;
}

const variants: Record<
  WolfButtonVariant,
  CSSProperties
> = {
  primary: {
    background: `linear-gradient(135deg, ${WolfColors.primary}, ${WolfColors.primaryHover})`,

    color: "#fff",

    border: "none",

    boxShadow: WolfShadows.glowOrange,
  },

  secondary: {
    background: WolfColors.card,

    color: WolfColors.text,

    border: `1px solid ${WolfColors.borderStrong}`,
  },

  ghost: {
    background: "transparent",

    color: WolfColors.text,

    border: "1px solid transparent",
  },

  danger: {
    background: WolfColors.danger,

    color: "#fff",

    border: "none",

    boxShadow: WolfShadows.md,
  },

  success: {
    background: WolfColors.success,

    color: "#fff",

    border: "none",

    boxShadow: WolfShadows.md,
  },
};

const heights = {
  sm: WolfSizes.button.sm,

  md: WolfSizes.button.md,

  lg: WolfSizes.button.lg,
};

const fontSizes = {
  sm: WolfTypography.size.md,

  md: WolfTypography.size.md,

  lg: WolfTypography.size.lg,
};

export default function WolfButton({
  children,

  variant = "primary",

  size = "md",

  loading = false,

  disabled = false,

  fullWidth = false,

  leftIcon,

  rightIcon,

  style,

  ...props
}: WolfButtonProps) {
  const isDisabled =
    disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      style={{
        display: "inline-flex",

        alignItems: "center",

        justifyContent: "center",

        gap: WolfSpacing.sm,

        height: heights[size],

        padding: `0 ${WolfSpacing.xl}px`,

        borderRadius: WolfRadius.lg,

        fontFamily:
          WolfTypography.fontFamily,

        fontSize: fontSizes[size],

        fontWeight:
          WolfTypography.weight.bold,

        cursor: isDisabled
          ? "not-allowed"
          : "pointer",

        transition:
          WolfTransitions.default,

        opacity: isDisabled
          ? 0.6
          : 1,

        width: fullWidth
          ? "100%"
          : undefined,

        userSelect: "none",

        outline: "none",

        willChange:
          "transform, box-shadow",

        ...variants[variant],

        ...style,
      }}
      onMouseEnter={(e) => {
        if (isDisabled) return;

        e.currentTarget.style.transform =
          "translateY(-2px)";

        if (variant === "primary") {
          e.currentTarget.style.boxShadow =
            WolfShadows.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (isDisabled) return;

        e.currentTarget.style.transform =
          "translateY(0)";

        if (variant === "primary") {
          e.currentTarget.style.boxShadow =
            WolfShadows.glowOrange;
        }
      }}
      onMouseDown={(e) => {
        if (isDisabled) return;

        e.currentTarget.style.transform =
          "scale(.98)";
      }}
      onMouseUp={(e) => {
        if (isDisabled) return;

        e.currentTarget.style.transform =
          "translateY(-2px)";
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width:
                WolfSizes.icon.md,

              height:
                WolfSizes.icon.md,

              borderRadius:
                WolfRadius.round,

              border:
                "2px solid rgba(255,255,255,.25)",

              borderTopColor:
                "#fff",

              animation:
                "wolfButtonSpin .7s linear infinite",
            }}
          />

          Cargando...
        </>
      ) : (
        <>
          {leftIcon}

          {children}

          {rightIcon}
        </>
      )}
    </button>
  );
}