import { CSSProperties } from "react";

import { WOLF_TIMING } from "./timing";

import {
  WOLF_EASE,
  WOLF_FAST,
  WOLF_HERO,
} from "./easing";

/*
==========================================================

WOLF SIDEBAR MOTION

==========================================================
*/

export const WolfSidebar = {

  /*
  --------------------------------------------------

  Item

  --------------------------------------------------
  */

  item: {

    transition:

      `all ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Hover

  --------------------------------------------------
  */

  hover: {

    transform:

      "translateX(6px)",

    transition:

      `transform ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Activo

  --------------------------------------------------
  */

  active: {

    transform:

      "translateX(10px) scale(1.02)",

    transition:

      `all ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Icono

  --------------------------------------------------
  */

  icon: {

    transition:

      `transform ${WOLF_TIMING.fast}ms ${WOLF_FAST}`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Label

  --------------------------------------------------
  */

  label: {

    transition:

      `opacity ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  } satisfies CSSProperties,

};

/*
==========================================================

Animación de entrada

==========================================================
*/

export const WolfSidebarReveal: CSSProperties = {

  animation:

    `wolfSidebarReveal ${WOLF_TIMING.medium}ms ${WOLF_HERO} forwards`,

};

/*
==========================================================

KEYFRAMES

==========================================================
*/

export const wolfSidebarKeyframes = `

@keyframes wolfSidebarReveal{

0%{

opacity:0;

transform:translateX(-20px);

}

100%{

opacity:1;

transform:translateX(0);

}

}

`;