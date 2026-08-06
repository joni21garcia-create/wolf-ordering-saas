import { CSSProperties } from "react";

import { WOLF_TIMING } from "./timing";

import {
  WOLF_EASE,
  WOLF_HERO,
} from "./easing";

/*
==========================================================

WOLF CHART MOTION

==========================================================
*/

export const WolfChart = {

  /*
  --------------------------------------------------

  Línea

  --------------------------------------------------
  */

  line: {

    strokeDasharray: 1800,

    strokeDashoffset: 1800,

    animation:

      `wolfChartDraw ${WOLF_TIMING.hero}ms ${WOLF_HERO} forwards`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Área

  --------------------------------------------------
  */

  area: {

    opacity: 0,

    animation:

      `wolfChartArea ${WOLF_TIMING.slow}ms ${WOLF_EASE} .35s forwards`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Punto

  --------------------------------------------------
  */

  point: {

    animation:

      `wolfPointPulse 2.8s ease infinite`,

    transformOrigin: "center",

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Etiquetas

  --------------------------------------------------
  */

  label: {

    opacity: 0,

    animation:

      `wolfLabelFade ${WOLF_TIMING.medium}ms ${WOLF_EASE} .8s forwards`,

  } satisfies CSSProperties,

};

/*
==========================================================

Transition

==========================================================
*/

export const WolfChartTransition =

`all ${WOLF_TIMING.normal}ms ${WOLF_EASE}`;

/*
==========================================================

KEYFRAMES

==========================================================
*/

export const wolfChartKeyframes = `

@keyframes wolfChartDraw{

to{

stroke-dashoffset:0;

}

}

@keyframes wolfChartArea{

0%{

opacity:0;

}

100%{

opacity:1;

}

}

@keyframes wolfPointPulse{

0%{

transform:scale(.8);

opacity:.35;

}

50%{

transform:scale(1.15);

opacity:.7;

}

100%{

transform:scale(.8);

opacity:.35;

}

}

@keyframes wolfLabelFade{

0%{

opacity:0;

transform:translateY(8px);

}

100%{

opacity:1;

transform:translateY(0);

}

}

`;