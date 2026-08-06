"use client";

import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import WolfButton from "./WolfButton";

export interface WolfEmptyProps
  extends HTMLAttributes<HTMLDivElement> {

  icon?: ReactNode;

  title: string;

  description?: string;

  actionLabel?: string;

  onAction?: () => void;

}

export default function WolfEmpty({

  icon = "🐺",

  title,

  description,

  actionLabel,

  onAction,

  style,

  ...props

}: WolfEmptyProps) {

  return (

<div

{...props}

style={{

display:"flex",

flexDirection:"column",

alignItems:"center",

justifyContent:"center",

textAlign:"center",

padding:"64px 32px",

borderRadius:24,

background:"#111111",

border:"1px solid rgba(255,255,255,.05)",

...style,

}}

>

<div
style={{

fontSize:58,

marginBottom:20,

}}

>

{icon}

</div>

<h2
style={{

margin:0,

fontSize:26,

fontWeight:800,

color:"#fff",

}}

>

{title}

</h2>

{description && (

<p
style={{

margin:"16px 0 0",

maxWidth:520,

fontSize:15,

lineHeight:1.7,

color:"#8b8b8b",

}}

>

{description}

</p>

)}

{actionLabel && onAction && (

<div
style={{

marginTop:30,

}}

>

<WolfButton
onClick={onAction}
>

{actionLabel}

</WolfButton>

</div>

)}

</div>

  );

}