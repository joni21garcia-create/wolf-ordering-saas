"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export interface WolfScrollAreaProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;

  horizontal?: boolean;

  hideScrollbar?: boolean;

  fullHeight?: boolean;

  smooth?: boolean;

  style?: CSSProperties;
}

export default function WolfScrollArea({
  children,

  horizontal = false,

  hideScrollbar = true,

  fullHeight = false,

  smooth = true,

  style,

  ...props
}: WolfScrollAreaProps) {
  return (
    <div
      {...props}
      className={
        hideScrollbar
          ? "wolf-scroll-area"
          : undefined
      }
      style={{
        overflowX: horizontal
          ? "auto"
          : "hidden",

        overflowY: horizontal
          ? "hidden"
          : "auto",

        WebkitOverflowScrolling: "touch",

        overscrollBehavior: "contain",

        scrollBehavior: smooth
          ? "smooth"
          : "auto",

        height: fullHeight
          ? "100%"
          : undefined,

        width: "100%",

        ...style,
      }}
    >
      {children}
    </div>
  );
}
