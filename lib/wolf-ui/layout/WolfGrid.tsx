"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfSpacing,
} from "../core";

export type WolfGridGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export interface WolfGridProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  columns?: number;

  minWidth?: number;

  gap?: WolfGridGap;

  fullWidth?: boolean;

  style?: CSSProperties;
}

const gapMap = {
  none: 0,

  xs: WolfSpacing.xs,

  sm: WolfSpacing.sm,

  md: WolfSpacing.md,

  lg: WolfSpacing.lg,

  xl: WolfSpacing.xl,

  "2xl": WolfSpacing["2xl"],

  "3xl": WolfSpacing["3xl"],
};

export default function WolfGrid({
  children,

  columns,

  minWidth = 320,

  gap = "lg",

  fullWidth = true,

  style,

  ...props
}: WolfGridProps) {
  return (
    <div
      {...props}
      style={{
        display: "grid",

        width: fullWidth
          ? "100%"
          : undefined,

        gap: gapMap[gap],

        gridTemplateColumns: columns
          ? `repeat(${columns}, minmax(0,1fr))`
          : `repeat(auto-fit,minmax(${minWidth}px,1fr))`,

        alignItems: "start",

        ...style,
      }}
    >
      {children}
    </div>
  );
}
