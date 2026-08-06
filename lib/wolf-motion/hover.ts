import { WOLF_TIMING } from "./timing";
import {
  WOLF_EASE,
  WOLF_FAST,
} from "./easing";

/*
==========================================================

WOLF HOVER SYSTEM

==========================================================
*/

export const WolfHover = {

  /*
  --------------------------------------------------
  Elevación suave
  --------------------------------------------------
  */

  lift: {

    transform:
      "translateY(-2px)",

    transition:

      `transform ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  },

  /*
  --------------------------------------------------
  Escala ligera
  --------------------------------------------------
  */

  scale: {

    transform:

      "scale(1.02)",

    transition:

      `transform ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  },

  /*
  --------------------------------------------------
  Glow naranja Wolf
  --------------------------------------------------
  */

  glow: {

    boxShadow:

      "0 0 18px rgba(249,115,22,.18)",

    transition:

      `box-shadow ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  },

  /*
  --------------------------------------------------
  Opacidad
  --------------------------------------------------
  */

  fade: {

    opacity:.82,

    transition:

      `opacity ${WOLF_TIMING.fast}ms ${WOLF_EASE}`,

  },

  /*
  --------------------------------------------------
  Iconos
  --------------------------------------------------
  */

  icon: {

    transform:

      "scale(1.08)",

    transition:

      `transform ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  },

};

/*
==========================================================

Transitions

==========================================================
*/

export const WolfTransition = {

  fast:

    `all ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  normal:

    `all ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  slow:

    `all ${WOLF_TIMING.slow}ms ${WOLF_EASE}`,

};