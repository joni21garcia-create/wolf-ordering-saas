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

  fallback?: string;

  size?: number;

  shadow?: boolean;

  border?: boolean;

  rounded?: boolean;
}

export default function WolfAvatar({

  src,

  alt = "Avatar",

  name,

  fallback,

  size = 44,

  shadow = false,

  border = false,

  rounded = true,

  style,

  ...props

}: WolfAvatarProps) {

  const text =
    fallback ??
    name ??
    "?";

  const initials = text
    .trim()
    .split(" ")
    .map(word => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const avatarStyle: CSSProperties = {

    width: size,

    height: size,

    borderRadius: rounded
      ? "50%"
      : 18,

    overflow: "hidden",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,

    userSelect: "none",

    position: "relative",

    background:
      "linear-gradient(135deg,#F97316,#EA580C)",

    color: "#fff",

    fontWeight: 800,

    fontSize: size * .36,

    border: border
      ? "2px solid rgba(255,255,255,.08)"
      : "none",

    boxShadow: shadow
      ? "0 16px 34px rgba(249,115,22,.18)"
      : "none",

    transition:
      "all .28s cubic-bezier(.22,.61,.36,1)",

    ...style,

  };

  return (

    <div
      {...props}
      style={avatarStyle}
    >

      {src ? (

        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

      ) : (

        initials

      )}

    </div>

  );

}