"use client";

import type {
  ButtonHTMLAttributes,
  CSSProperties,
  ReactNode,
} from "react";

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

  children: ReactNode;

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

    background:
      "linear-gradient(135deg,#F97316,#EA580C)",

    color: "#fff",

    border: "none",

    boxShadow:
      "0 12px 28px rgba(249,115,22,.25)",

  },

  secondary: {

    background: "#181818",

    color: "#fff",

    border:
      "1px solid rgba(255,255,255,.08)",

  },

  ghost: {

    background: "transparent",

    color: "#fff",

    border:
      "1px solid transparent",

  },

  danger: {

    background: "#DC2626",

    color: "#fff",

    border: "none",

  },

  success: {

    background: "#16A34A",

    color: "#fff",

    border: "none",

  },

};

const heights = {

  sm: 38,

  md: 46,

  lg: 56,

} as const;

const fontSizes = {

  sm: 14,

  md: 15,

  lg: 16,

} as const;

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

display:"inline-flex",

alignItems:"center",

justifyContent:"center",

gap:10,

height:heights[size],

padding:"0 20px",

borderRadius:16,

fontSize:fontSizes[size],

fontWeight:700,

cursor:isDisabled

? "not-allowed"

: "pointer",

transition:

"all .25s cubic-bezier(.22,.61,.36,1)",

opacity:isDisabled

? .6

: 1,

width:fullWidth

? "100%"

: undefined,

userSelect:"none",

outline:"none",

...variants[variant],

...style,

}}

onMouseEnter={(e)=>{

if(isDisabled) return;

e.currentTarget.style.transform=

"translateY(-2px)";

}}

onMouseLeave={(e)=>{

if(isDisabled) return;

e.currentTarget.style.transform=

"translateY(0px)";

}}

>

{loading ? (

<>

<span

style={{

width:16,

height:16,

borderRadius:"50%",

border:"2px solid rgba(255,255,255,.25)",

borderTopColor:"#fff",

animation:

"wolfButtonSpin .7s linear infinite",

}}

 />

Cargando...

</>

) : (

<>

{leftIcon}

<span>

{children}

</span>

{rightIcon}

</>

)}

<style>{`

@keyframes wolfButtonSpin{

to{

transform:rotate(360deg);

}

}

`}</style>

</button>

  );

}