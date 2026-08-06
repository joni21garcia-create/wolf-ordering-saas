import { CSSProperties } from "react";

import { WOLF_TIMING } from "./timing";

import {
  WOLF_EASE,
  WOLF_HERO,
} from "./easing";

/*
==========================================================

WOLF HERO

==========================================================
*/

export const WolfHero = {

  /*
  --------------------------------------------------

  Entrada

  --------------------------------------------------
  */

  reveal: {

    animation:

      `wolfHeroReveal ${WOLF_TIMING.hero}ms ${WOLF_HERO} forwards`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Glow

  --------------------------------------------------
  */

  glow: {

    animation:

      `wolfHeroGlow 18s linear infinite alternate`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Número principal

  --------------------------------------------------
  */

  total: {

    animation:

      `wolfHeroPop ${WOLF_TIMING.medium}ms ${WOLF_EASE}`,

  } satisfies CSSProperties,

  /*
  --------------------------------------------------

  Badge

  --------------------------------------------------
  */

  badge: {

    animation:

      `wolfBadgeReveal ${WOLF_TIMING.medium}ms ${WOLF_EASE}`,

  } satisfies CSSProperties,

};

/*
==========================================================

BACKGROUND

==========================================================
*/

export const WolfHeroBackground: CSSProperties = {

  position: "absolute",

  inset: 0,

  pointerEvents: "none",

};

/*
==========================================================

KEYFRAMES

==========================================================
*/

export const wolfHeroKeyframes = `

@keyframes wolfHeroReveal{

0%{

opacity:0;

transform:translateY(24px);

}

100%{

opacity:1;

transform:translateY(0);

}

}

@keyframes wolfHeroGlow{

0%{

transform:

translate3d(-12px,-8px,0)

scale(1);

opacity:.55;

}

50%{

transform:

translate3d(12px,6px,0)

scale(1.08);

opacity:.75;

}

100%{

transform:

translate3d(-6px,10px,0)

scale(1);

opacity:.55;

}

}

@keyframes wolfHeroPop{

0%{

opacity:0;

transform:scale(.92);

}

100%{

opacity:1;

transform:scale(1);

}

}

@keyframes wolfBadgeReveal{

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