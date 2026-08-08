/**
 * ============================================================
 * Wolf UI
 * Typography
 * Sistema oficial de tipografía
 * ============================================================
 */

export const WolfTypography = {
  /* ----------------------------------------------------------
   * Font Family
   * ---------------------------------------------------------- */

  fontFamily:
    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

  /* ----------------------------------------------------------
   * Font Sizes
   * ---------------------------------------------------------- */

  size: {
    xs: 11,

    sm: 12,

    md: 14,

    lg: 16,

    xl: 18,

    "2xl": 20,

    "3xl": 24,

    "4xl": 28,

    "5xl": 34,
  },

  /* ----------------------------------------------------------
   * Font Weight
   * ---------------------------------------------------------- */

  weight: {
    regular: 400,

    medium: 500,

    semibold: 600,

    bold: 700,

    extrabold: 800,
  },

  /* ----------------------------------------------------------
   * Line Height
   * ---------------------------------------------------------- */

  lineHeight: {
    tight: 1.15,

    normal: 1.4,

    relaxed: 1.6,
  },
} as const;

export type WolfTypographyType = typeof WolfTypography;