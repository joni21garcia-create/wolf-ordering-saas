/**
 * ============================================================
 * Wolf UI
 * Breakpoints
 * Sistema oficial Responsive
 * ============================================================
 */

export const WolfBreakpoints = {
  xs: 360,

  sm: 480,

  md: 768,

  lg: 1024,

  xl: 1280,

  "2xl": 1440,

  "3xl": 1600,
} as const;

export const WolfMedia = {
  xs: `(max-width:${WolfBreakpoints.xs}px)`,

  sm: `(max-width:${WolfBreakpoints.sm}px)`,

  md: `(max-width:${WolfBreakpoints.md}px)`,

  lg: `(max-width:${WolfBreakpoints.lg}px)`,

  xl: `(max-width:${WolfBreakpoints.xl}px)`,

  mobile: `(max-width:${WolfBreakpoints.md}px)`,

  tablet: `(min-width:${WolfBreakpoints.md + 1}px) and (max-width:${WolfBreakpoints.lg}px)`,

  desktop: `(min-width:${WolfBreakpoints.lg + 1}px)`,
} as const;

export type WolfBreakpointKey = keyof typeof WolfBreakpoints;