"use client";

import type { CSSProperties } from "react";
import { useMemo } from "react";
import { getDiscoverBadge } from "@/modules/discover/config/discoverBadges";

interface DiscoverBadgeProps {
  type?: string | null;
  className?: string;
  style?: CSSProperties;
  size?: "sm" | "md";
}

const badgeStyles = `
.discover-badge {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transform: translateZ(0);
  min-height: 26px;
  border: 1px solid rgba(255,255,255,.10);
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(18,18,18,.88), rgba(7,7,7,.68));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.075),
    inset 0 -1px 0 rgba(0,0,0,.18),
    0 7px 20px rgba(0,0,0,.16);
  backdrop-filter: blur(16px) saturate(125%);
  -webkit-backdrop-filter: blur(16px) saturate(125%);
  transition:
    transform 180ms cubic-bezier(.2,.8,.2,1),
    border-color 180ms ease,
    box-shadow 180ms ease;
}

/* Halo suave para insignias no Premium. */
.discover-badge::before {
  content: "";
  position: absolute;
  inset: -70%;
  z-index: -1;
  border-radius: 999px;
  pointer-events: none;
}

.discover-badge__icon,
.discover-badge__label {
  position: relative;
  z-index: 2;
}

.discover-badge__icon {
  flex-shrink: 0;
  transform-origin: center;
}

.discover-badge:hover {
  transform: translateY(-1px);
  border-color: rgba(255,255,255,.16);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.09),
    0 10px 24px rgba(0,0,0,.20);
}

.discover-badge:active {
  transform: scale(.97);
}

/* PREMIUM
   La insignia Premium NO tiene glow difuso.
   La única luz animada es una cabeza pequeña que recorre el borde. */
.discover-badge--premium {
  position: relative;
  border-color: rgba(251,191,36,.34);
  background: linear-gradient(135deg, rgba(34,25,7,.94), rgba(12,10,6,.82));
  box-shadow:
    0 8px 22px rgba(0,0,0,.20),
    inset 0 1px 0 rgba(255,248,210,.18),
    inset 0 0 0 1px rgba(251,191,36,.10);
}

.discover-badge--premium::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  box-shadow:
    inset 0 1px 5px rgba(255,236,150,.10),
    inset 0 -1px 4px rgba(251,191,36,.06);
}


/* Apaga por completo los dos efectos genéricos en Premium. */
/* Pista de borde estática + punto de luz móvil.
   El mask deja visible únicamente el anillo, nunca el contenido. */
.discover-badge--premium::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: 0;
  padding: 1.5px;
  border-radius: inherit;
  pointer-events: none;
  background:
    conic-gradient(
      from 0deg,
      rgba(251,191,36,.20) 0deg,
      rgba(251,191,36,.20) 300deg,
      rgba(255,248,205,1) 316deg,
      rgba(251,191,36,.58) 326deg,
      rgba(251,191,36,.20) 342deg,
      rgba(251,191,36,.20) 360deg
    );
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask-composite: exclude;
  animation: premiumBorderOrbit 3.2s linear infinite;
}

/* Contenido siempre por encima del borde animado. */
.discover-badge--premium .discover-badge__icon,
.discover-badge--premium .discover-badge__label {
  z-index: 3;
}

.discover-badge--premium .discover-badge__icon {
  color: #fbbf24;
  filter: none;
  animation: badgePremiumIcon 3.8s ease-in-out infinite;
}

.discover-badge--premium .discover-badge__label {
  color: #fff7d1;
  text-shadow: none;
}

/* Resto de insignias */
.discover-badge--wolf {
  border-color: rgba(249,115,22,.18);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 18px rgba(249,115,22,.08);
}
.discover-badge--wolf::before {
  background: radial-gradient(circle, rgba(249,115,22,.22), transparent 65%);
  animation: badgeWolfGlow 3.4s ease-in-out infinite;
}
.discover-badge--wolf .discover-badge__icon {
  color: #fb923c;
  animation: badgeWolfIcon 3.4s ease-in-out infinite;
}

.discover-badge--featured {
  border-color: rgba(255,255,255,.13);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 16px rgba(255,255,255,.045);
}
.discover-badge--featured::before {
  background: radial-gradient(circle, rgba(255,255,255,.15), transparent 66%);
  animation: badgeFeaturedGlow 2.8s ease-in-out infinite;
}
.discover-badge--featured .discover-badge__icon {
  color: #e2e8f0;
  animation: badgeFeaturedIcon 2.8s ease-in-out infinite;
}

.discover-badge--discover {
  border-color: rgba(148,163,184,.13);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 16px rgba(148,163,184,.045);
}
.discover-badge--discover::before {
  background: radial-gradient(circle, rgba(148,163,184,.14), transparent 64%);
  animation: badgeDiscoverGlow 3.2s ease-in-out infinite;
}
.discover-badge--discover .discover-badge__icon {
  color: #e2e8f0;
  animation: badgeDiscoverIcon 3.2s ease-in-out infinite;
}

.discover-badge--popular {
  border-color: rgba(249,115,22,.17);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 18px rgba(249,115,22,.08);
}
.discover-badge--popular::before {
  background: radial-gradient(circle, rgba(249,115,22,.18), transparent 64%);
  animation: badgePopularGlow 1.9s ease-in-out infinite;
}
.discover-badge--popular .discover-badge__icon {
  color: #fb923c;
  animation: badgePopularIcon 1.9s ease-in-out infinite;
}

.discover-badge--new {
  border-color: rgba(52,211,153,.15);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 17px rgba(52,211,153,.06);
}
.discover-badge--new::before {
  background: radial-gradient(circle, rgba(52,211,153,.16), transparent 64%);
  animation: badgeNewGlow 2.7s ease-in-out infinite;
}
.discover-badge--new .discover-badge__icon {
  color: #a7f3d0;
  animation: badgeNewIcon 2.7s ease-in-out infinite;
}

.discover-badge--promoted {
  border-color: rgba(249,115,22,.16);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 0 18px rgba(249,115,22,.07);
}
.discover-badge--promoted::before {
  background: radial-gradient(circle, rgba(249,115,22,.17), transparent 64%);
  animation: badgePromotedGlow 2.6s ease-in-out infinite;
}
.discover-badge--promoted .discover-badge__icon {
  color: #fdba74;
  animation: badgePromotedIcon 2.6s ease-in-out infinite;
}

@keyframes badgeWolfGlow {
  0%,100% { transform: scale(.82); opacity: .35; }
  50% { transform: scale(1.08); opacity: .85; }
}
@keyframes badgeFeaturedGlow {
  0%,100% { transform: scale(.78) rotate(0deg); opacity: .28; }
  50% { transform: scale(1.08) rotate(7deg); opacity: .75; }
}
@keyframes badgeDiscoverGlow {
  0%,100% { transform: scale(.75); opacity: .22; }
  45% { transform: scale(1.02); opacity: .65; }
  70% { transform: scale(.88); opacity: .38; }
}
@keyframes badgePopularGlow {
  0%,100% { transform: scale(.82); opacity: .25; }
  42% { transform: scale(1.14); opacity: .72; }
  58% { transform: scale(.96); opacity: .48; }
}
@keyframes badgeNewGlow {
  0%,100% { transform: scale(.84); opacity: .25; }
  45% { transform: scale(1.10); opacity: .68; }
}
@keyframes badgePromotedGlow {
  0%,100% { transform: translateX(-2px) scale(.88); opacity: .25; }
  50% { transform: translateX(5px) scale(1.08); opacity: .72; }
}
@keyframes badgeWolfIcon {
  0%,78%,100% { transform: rotate(0deg) scale(1); }
  84% { transform: rotate(-7deg) scale(1.12); }
  90% { transform: rotate(5deg) scale(1.04); }
}
@keyframes badgeFeaturedIcon {
  0%,72%,100% { transform: scale(1) rotate(0deg); }
  78% { transform: scale(1.18) rotate(-5deg); }
  84% { transform: scale(1) rotate(5deg); }
}
@keyframes badgeDiscoverIcon {
  0%,100% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
}
@keyframes badgePremiumIcon {
  0%,72%,100% { transform: translateY(0) scale(1); }
  80% { transform: translateY(-1px) scale(1.13); }
  86% { transform: translateY(0) scale(1); }
}
@keyframes badgePopularIcon {
  0%,100% { transform: translateY(0) scale(1); }
  35% { transform: translateY(-1px) scale(1.10); }
  48% { transform: translateY(0) scale(.98); }
}
@keyframes badgeNewIcon {
  0%,68%,100% { transform: scale(1); }
  74% { transform: scale(1.15) rotate(-4deg); }
  82% { transform: scale(1) rotate(4deg); }
}
@keyframes badgePromotedIcon {
  0%,100% { transform: translateX(0) rotate(0deg); }
  45% { transform: translateX(2px) rotate(-4deg); }
  58% { transform: translateX(0) rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .discover-badge,
  .discover-badge::before,
  .discover-badge::after,
  .discover-badge__icon {
    animation: none !important;
    transition: none !important;
  }

  .discover-badge:hover,
  .discover-badge:active {
    transform: none !important;
  }
}
`;

export default function DiscoverBadge({
  type,
  className = "",
  style,
  size = "sm",
}: DiscoverBadgeProps) {
  const badge = useMemo(() => getDiscoverBadge(type), [type]);

  if (!badge) return null;

  const sizeStyles: CSSProperties =
    size === "md"
      ? {
          gap: 6,
          padding: "7px 10px",
          fontSize: 11,
        }
      : {
          gap: 5,
          padding: "6px 9px",
          fontSize: 10,
        };

  const visualClass = `discover-badge--${type}`;
  const Icon = badge.icon;

  return (
    <>
      <style>{badgeStyles}</style>

      <span
        className={`discover-badge ${visualClass} ${className}`.trim()}
        style={{
          ...sizeStyles,
          ...style,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
          maxWidth: "calc(100% - 58px)",
        }}
        aria-label={badge.label}
      >
        <Icon
          className="discover-badge__icon"
          size={size === "md" ? 12 : 11}
          strokeWidth={1.9}
          aria-hidden="true"
        />
        <span className="discover-badge__label">{badge.label}</span>
      </span>
    </>
  );
}