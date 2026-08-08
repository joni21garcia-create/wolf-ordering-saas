/**
 * ============================================================
 * Wolf UI
 * Radius
 * Sistema oficial de bordes
 * ============================================================
 */

export const WolfRadius = {
  none: 0,

  xs: 4,

  sm: 8,

  md: 12,

  lg: 16,

  xl: 20,

  "2xl": 24,

  "3xl": 28,

  round: 9999,
} as const;

export type WolfRadiusKey = keyof typeof WolfRadius;