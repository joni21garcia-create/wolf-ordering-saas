"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface WolfCenterProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  inline?: boolean;

  fullWidth?: boolean;

  fullHeight?: boolean;

  style?: CSSProperties;
}

export default function WolfCenter({
  children,

  inline = false,

  fullWidth = false,

  fullHeight = false,

  style,

  ...props
}: WolfCenterProps) {
  const Component = inline ? "span" : "div";

  return (
    <Component
      {...props}
      style={{
        display: inline
          ? "inline-flex"
          : "flex",

        alignItems: "center",

        justifyContent: "center",

        width: fullWidth
          ? "100%"
          : undefined,

        height: fullHeight
          ? "100%"
          : undefined,

        ...style,
      }}
    >
      {children}
    </Component>
  );
}
