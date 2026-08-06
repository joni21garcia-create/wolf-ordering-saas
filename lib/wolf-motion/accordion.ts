import { CSSProperties } from "react";

import { WOLF_TIMING } from "./timing";
import {
  WOLF_EASE,
  WOLF_EXPAND,
} from "./easing";

/*
==========================================================

WOLF ACCORDION

==========================================================
*/
export interface WolfAccordionStyle {

  container: CSSProperties;

  body: CSSProperties;

  chevron: CSSProperties;

}

export function wolfAccordion(

  open: boolean

): WolfAccordionStyle {

return {

  /*
  ---------------------------------------------
  Contenedor
  ---------------------------------------------
  */

  container: {

    overflow: "hidden",

    borderRadius: 22,

    transition:

      `all ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  },

  /*
  ---------------------------------------------
  Contenido
  ---------------------------------------------
  */

  body: {

    maxHeight:

      open

        ? 2000

        : 0,

    opacity:

      open

        ? 1

        : 0,

    transform:

      open

        ? "translateY(0)"

        : "translateY(-8px)",

    overflow: "hidden",

    transition: `

max-height ${WOLF_TIMING.slow}ms ${WOLF_EXPAND},

opacity ${WOLF_TIMING.normal}ms ${WOLF_EASE},

transform ${WOLF_TIMING.normal}ms ${WOLF_EASE}

    `,

    willChange:

      "max-height,opacity,transform",

  },

  /*
  ---------------------------------------------
  Flecha
  ---------------------------------------------
  */

  chevron: {

    transform:

      open

        ? "rotate(180deg)"

        : "rotate(0deg)",

    transition:

      `transform ${WOLF_TIMING.normal}ms ${WOLF_EASE}`,

  },

};

} 

/*
==========================================================

Keyframes

==========================================================
*/

export const wolfAccordionKeyframes = `

@keyframes wolfReveal{

0%{

opacity:0;

transform:translateY(18px);

}

100%{

opacity:1;

transform:translateY(0);

}

}

`;