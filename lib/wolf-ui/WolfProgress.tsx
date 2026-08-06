"use client";

import type {
  CSSProperties,
  HTMLAttributes,
} from "react";

export interface WolfProgressProps
  extends HTMLAttributes<HTMLDivElement> {

  value: number;

  color?: string;

  height?: number;

  animated?: boolean;

  showValue?: boolean;

}

export default function WolfProgress({

  value,

  color = "#F97316",

  height = 8,

  animated = true,

  showValue = false,

  style,

  ...props

}: WolfProgressProps) {

  const progress = Math.max(
    0,
    Math.min(value, 100)
  );

  return (

<div
{...props}
style={{
display:"flex",
alignItems:"center",
gap:12,
width:"100%",
...style,
}}
>

<div
style={{
flex:1,
height,
borderRadius:999,
overflow:"hidden",
background:"rgba(255,255,255,.06)",
}}
>

<div
style={{
width:`${progress}%`,
height:"100%",
borderRadius:999,
background:color,
transition:animated
? "width .7s cubic-bezier(.22,.61,.36,1)"
: undefined,
}}
/>

</div>

{showValue && (

<span
style={{
minWidth:42,
textAlign:"right",
fontSize:13,
fontWeight:700,
color:"#8b8b8b",
}}
>

{progress.toFixed(0)}%

</span>

)}

</div>

  );

}