"use client";

import type {
  CSSProperties,
  HTMLAttributes,
} from "react";

import {
  WolfSpacing,
} from "../core";

export type WolfSpacerSize =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

export interface WolfSpacerProps
  extends HTMLAttributes<HTMLDivElement> {
  size?: WolfSpacerSize;

  horizontal?: boolean;

  flex?: number;

  style?: CSSProperties;
}

const spacingMap = {
  none: 0,

  xs: WolfSpacing.xs,

  sm: WolfSpacing.sm,

  md: WolfSpacing.md,

  lg: WolfSpacing.lg,

  xl: WolfSpacing.xl,

  "2xl": WolfSpacing["2xl"],

  "3xl": WolfSpacing["3xl"],

  "4xl": WolfSpacing["4xl"],
};

export default function WolfSpacer({
  size = "lg",

  horizontal = false,

  flex,

  style,

  ...props
}: WolfSpacerProps) {
  if (flex !== undefined) {
    return (
      <div
        {...props}
        style={{
          flex,

          ...style,
        }}
      />
    );
  }

  return (
    <div
      {...props}
      style={{
        flexShrink: 0,

        width: horizontal
          ? spacingMap[size]
          : 1,

        height: horizontal
          ? 1
          : spacingMap[size],

        ...style,
      }}
    />
  );
}
