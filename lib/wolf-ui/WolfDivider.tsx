"use client";

import type {
  CSSProperties,
  HTMLAttributes,
} from "react";

export interface WolfDividerProps
  extends HTMLAttributes<HTMLHRElement> {

  spacing?: number;

  color?: string;

  vertical?: boolean;

}

export default function WolfDivider({

  spacing = 24,

  color = "rgba(255,255,255,.06)",

  vertical = false,

  style,

  ...props

}: WolfDividerProps) {

  if (vertical) {

    return (

      <div
        {...props}
        style={{
          width: 1,
          alignSelf: "stretch",
          background: color,
          margin: `0 ${spacing}px`,
          ...style,
        }}
      />

    );

  }

  return (

    <hr

      {...props}

      style={{

        border: "none",

        height: 1,

        background: color,

        margin: `${spacing}px 0`,

        width: "100%",

        ...style,

      }}

    />

  );

}