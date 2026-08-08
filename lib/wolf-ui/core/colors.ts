/**
 * ============================================================
 * Wolf UI
 * Colors
 * Sistema oficial de colores de Wolf Ordering
 * ============================================================
 */

export const WolfColors = {
  /* ----------------------------------------------------------
   * Base
   * ---------------------------------------------------------- */

  background: "#090909",

  surface: "#121212",
surfaceLight: "#1A1A1A",

  card: "#181818",

  cardHover: "#1E1E1E",

  overlay: "rgba(0,0,0,.65)",

  border: "rgba(255,255,255,.06)",

  borderStrong: "rgba(255,255,255,.12)",

  divider: "rgba(255,255,255,.08)",

  /* ----------------------------------------------------------
   * Texto
   * ---------------------------------------------------------- */

  text: "#FFFFFF",

  textSecondary: "#A1A1AA",

  textMuted: "#71717A",

  textDisabled: "#52525B",

  /* ----------------------------------------------------------
   * Marca
   * ---------------------------------------------------------- */

  primary: "#F97316",

  primaryHover: "#EA580C",

  primarySoft: "rgba(249,115,22,.12)",

  /* ----------------------------------------------------------
   * Estados
   * ---------------------------------------------------------- */

  success: "#22C55E",

  successSoft: "rgba(34,197,94,.12)",

  warning: "#FACC15",

  warningSoft: "rgba(250,204,21,.12)",

  danger: "#EF4444",

  dangerSoft: "rgba(239,68,68,.12)",

  info: "#3B82F6",

  infoSoft: "rgba(59,130,246,.12)",

  purple: "#8B5CF6",

  purpleSoft: "rgba(139,92,246,.12)",

  cyan: "#06B6D4",

  cyanSoft: "rgba(6,182,212,.12)",

  /* ----------------------------------------------------------
   * Pedidos
   * ---------------------------------------------------------- */

  pending: "#F97316",

  accepted: "#3B82F6",

  preparing: "#8B5CF6",

  ready: "#22C55E",

  delivery: "#06B6D4",

  completed: "#71717A",
} as const;

export type WolfColor = keyof typeof WolfColors;
