/**
 * ============================================================
 * Wolf UI
 * Shadows
 * Sistema oficial de elevaciones
 * ============================================================
 */

export const WolfShadows = {
  none: "none",

  xs: "0 1px 3px rgba(0,0,0,.12)",

  sm: "0 4px 10px rgba(0,0,0,.18)",

  md: "0 10px 24px rgba(0,0,0,.24)",

  lg: "0 18px 40px rgba(0,0,0,.30)",

  xl: "0 28px 60px rgba(0,0,0,.38)",

  glowOrange:
    "0 0 0 1px rgba(249,115,22,.20), 0 12px 30px rgba(249,115,22,.18)",

  glowGreen:
    "0 0 0 1px rgba(34,197,94,.20), 0 12px 30px rgba(34,197,94,.18)",

  glowBlue:
    "0 0 0 1px rgba(59,130,246,.20), 0 12px 30px rgba(59,130,246,.18)",

  inset:
    "inset 0 1px 0 rgba(255,255,255,.03)",
} as const;

export type WolfShadowKey = keyof typeof WolfShadows;