"use client";

import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
} from "react";

export type WolfBadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "orange";

export interface WolfBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {

  children: ReactNode;

  variant?: WolfBadgeVariant;

}

const variants: Record<
  WolfBadgeVariant,
  CSSProperties
> = {

  default: {

    background:
      "rgba(255,255,255,.08)",

    color: "#fff",

  },

  success: {

    background:
      "rgba(34,197,94,.14)",

    color: "#22C55E",

  },

  warning: {

    background:
      "rgba(245,158,11,.14)",

    color: "#F59E0B",

  },

  danger: {

    background:
      "rgba(239,68,68,.14)",

    color: "#EF4444",

  },

  info: {

    background:
      "rgba(59,130,246,.14)",

    color: "#3B82F6",

  },

  orange: {

    background:
      "rgba(249,115,22,.14)",

    color: "#F97316",

  },

};

export default function WolfBadge({

  children,

  variant="default",

  style,

  ...props

}:WolfBadgeProps){

return(

<span

{...props}

style={{

display:"inline-flex",

alignItems:"center",

justifyContent:"center",

gap:6,

padding:"6px 12px",

borderRadius:999,

fontSize:12,

fontWeight:700,

lineHeight:1,

whiteSpace:"nowrap",

userSelect:"none",

...variants[variant],

...style,

}}

>

{children}

</span>

);

}