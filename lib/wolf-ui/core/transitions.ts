/**
 * ============================================================
 * Wolf UI
 * Transitions
 * Sistema oficial de transiciones y animaciones
 * ============================================================
 */

export const WolfTransitions = {
  /* ----------------------------------------------------------
   * Duraciones
   * ---------------------------------------------------------- */

  instant: "80ms",

  fast: "150ms",

  normal: "220ms",

  slow: "320ms",

  slower: "450ms",

  /* ----------------------------------------------------------
   * Curvas
   * ---------------------------------------------------------- */

  ease: "ease",

  easeIn: "ease-in",

  easeOut: "ease-out",

  easeInOut: "ease-in-out",

  smooth: "cubic-bezier(.22,.61,.36,1)",

  /* ----------------------------------------------------------
   * Transiciones completas
   * ---------------------------------------------------------- */

  default: "all 220ms cubic-bezier(.22,.61,.36,1)",

  colors:
    "background-color 220ms cubic-bezier(.22,.61,.36,1), color 220ms cubic-bezier(.22,.61,.36,1)",

  transform:
    "transform 180ms cubic-bezier(.22,.61,.36,1)",

  opacity:
    "opacity 180ms cubic-bezier(.22,.61,.36,1)",

  shadow:
    "box-shadow 220ms cubic-bezier(.22,.61,.36,1)",

  border:
    "border-color 220ms cubic-bezier(.22,.61,.36,1)",
} as const;

export type WolfTransitionKey = keyof typeof WolfTransitions;