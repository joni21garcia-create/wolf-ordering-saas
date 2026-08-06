"use client";

import Image from "next/image";

import type {
  CSSProperties,
  HTMLAttributes,
} from "react";

export interface WolfAvatarProps
  extends HTMLAttributes<HTMLDivElement> {

  src?: string | null;

  alt?: string;

  name?: string;

  size?: number;

}

export default function WolfAvatar({

  src,

  alt = "Avatar",

  name,

  size = 44,

  style,

  ...props

}: WolfAvatarProps) {

  const initials =

    name

      ?.trim()

      .split(" ")

      .map((word) => word[0])

      .slice(0, 2)

      .join("")
      .toUpperCase() ??

    "?";

  return (

<div

{...props}

style={{

width:size,

height:size,

borderRadius:"50%",

overflow:"hidden",

display:"flex",

alignItems:"center",

justifyContent:"center",

background:

"linear-gradient(135deg,#F97316,#EA580C)",

color:"#fff",

fontWeight:700,

fontSize:size*0.36,

flexShrink:0,

userSelect:"none",

...style,

}}

>

{src ? (

<Image

src={src}

alt={alt}

width={size}

height={size}

style={{

width:"100%",

height:"100%",

objectFit:"cover",

}}

 />

) : (

initials

)}

</div>

  );

}