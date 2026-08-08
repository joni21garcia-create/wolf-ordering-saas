"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfSpacing,
} from "../core";

export type WolfFlexGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type WolfFlexAlign =
  | "start"
  | "center"
  | "end"
  | "stretch"
  | "baseline";

export type WolfFlexJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface WolfFlexProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  gap?: WolfFlexGap;

  align?: WolfFlexAlign;

  justify?: WolfFlexJustify;

  wrap?: boolean;

  fullWidth?: boolean;

  direction?:
  | "row"
  | "column";

  fullHeight?: boolean;

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

const alignMap = {
  start: "flex-start",

  center: "center",

  end: "flex-end",

  stretch: "stretch",

  baseline: "baseline",
};

const justifyMap = {
  start: "flex-start",

  center: "center",

  end: "flex-end",

  between: "space-between",

  around: "space-around",

  evenly: "space-evenly",
};

export default function WolfFlex({
  children,

  gap = "md",

  align = "center",

  justify = "start",

  wrap = false,

  fullWidth = false,

  fullHeight = false,

  style,

  ...props
}: WolfFlexProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",

        flexDirection: "row",

        alignItems: alignMap[align],

        justifyContent: justifyMap[justify],

        gap: gapMap[gap],

        flexWrap: wrap ? "wrap" : "nowrap",

        width: fullWidth ? "100%" : undefined,

        height: fullHeight ? "100%" : undefined,

        ...style,
      }}
    >
      {children}
    </div>
  );
}
