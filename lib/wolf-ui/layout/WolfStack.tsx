"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfSpacing,
} from "../core";

export type WolfStackGap =
  | "none"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl";

export type WolfStackAlign =
  | "stretch"
  | "start"
  | "center"
  | "end";

export type WolfStackJustify =
  | "start"
  | "center"
  | "end"
  | "between"
  | "around"
  | "evenly";

export interface WolfStackProps
  extends HTMLAttributes<HTMLDivElement> {

  children: ReactNode;

  /**
   * API antigua
   */
  gap?: WolfStackGap;

  /**
   * API nueva
   * Alias de gap
   */
  spacing?: WolfStackGap;

  align?: WolfStackAlign;

  justify?: WolfStackJustify;

  fullWidth?: boolean;

  style?: CSSProperties;
}

const gapMap: Record<WolfStackGap, number> = {

  none: 0,

  xs: WolfSpacing.xs,

  sm: WolfSpacing.sm,

  md: WolfSpacing.md,

  lg: WolfSpacing.lg,

  xl: WolfSpacing.xl,

  "2xl": WolfSpacing["2xl"],

  "3xl": WolfSpacing["3xl"],

};

const alignMap: Record<
  WolfStackAlign,
  CSSProperties["alignItems"]
> = {

  stretch: "stretch",

  start: "flex-start",

  center: "center",

  end: "flex-end",

};

const justifyMap: Record<
  WolfStackJustify,
  CSSProperties["justifyContent"]
> = {

  start: "flex-start",

  center: "center",

  end: "flex-end",

  between: "space-between",

  around: "space-around",

  evenly: "space-evenly",

};

export default function WolfStack({

  children,

  gap,

  spacing,

  align = "stretch",

  justify = "start",

  fullWidth = false,

  style,

  ...props

}: WolfStackProps) {

  const resolvedGap =
    spacing ?? gap ?? "lg";

  return (

    <div
      {...props}
      style={{

        display: "flex",

        flexDirection: "column",

        gap: gapMap[resolvedGap],

        alignItems:
          alignMap[align],

        justifyContent:
          justifyMap[justify],

        width: fullWidth
          ? "100%"
          : undefined,

        ...style,

      }}
    >

      {children}

    </div>

  );

}