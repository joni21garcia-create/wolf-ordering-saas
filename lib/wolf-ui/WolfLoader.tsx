"use client";

import type {
  HTMLAttributes,
} from "react";

export interface WolfLoaderProps
  extends HTMLAttributes<HTMLDivElement> {

  size?: number;

  color?: string;

  label?: string;

}

export default function WolfLoader({

  size = 44,

  color = "#F97316",

  label,

  style,

  ...props

}: WolfLoaderProps) {

  return (

<div

{...props}

style={{

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

gap:18,

padding:24,

...style,

}}

>

<div
style={{

width:size,

height:size,

borderRadius:"50%",

border:`3px solid rgba(255,255,255,.08)`,

borderTop:`3px solid ${color}`,

animation:"wolfLoaderSpin .75s linear infinite",

}}

 />

{label && (

<div
style={{

fontSize:14,

fontWeight:600,

color:"#8b8b8b",

}}

>

{label}

</div>

)}

<style>{`

@keyframes wolfLoaderSpin{

to{

transform:rotate(360deg);

}

}

`}</style>

</div>

  );

}