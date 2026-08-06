/*
==========================================================

WOLF MOTION

Timing System

==========================================================
*/

export const WOLF_TIMING = {

  instant: 0,

  ultraFast: 120,

  fast: 180,

  normal: 260,

  medium: 340,

  slow: 520,

  slower: 800,

  hero: 1200,

} as const;

export type WolfTiming =
  keyof typeof WOLF_TIMING;