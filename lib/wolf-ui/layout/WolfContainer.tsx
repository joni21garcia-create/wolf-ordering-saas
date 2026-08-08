"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

import {
  WolfSpacing,
  WolfBreakpoints,
} from "../core";

export type WolfContainerSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

export interface WolfContainerProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  size?: WolfContainerSize;

  centered?: boolean;

  padding?: boolean;

  style?: CSSProperties;
}

const maxWidths = {
  sm: 640,

  md: 960,

  lg: 1280,

  xl: 1440,

  full: "100%",
};

export default function WolfContainer({
  children,

  size = "lg",

  centered = true,

  padding = true,

  style,

  ...props
}: WolfContainerProps) {
  return (
    <div
      {...props}
      style={{
        width: "100%",

        maxWidth: maxWidths[size],

        margin: centered
          ? "0 auto"
          : undefined,

        paddingLeft: padding
          ? WolfSpacing["2xl"]
          : 0,

        paddingRight: padding
          ? WolfSpacing["2xl"]
          : 0,

        boxSizing: "border-box",

        ...style,
      }}
    >
      {children}
    </div>
  );
}
