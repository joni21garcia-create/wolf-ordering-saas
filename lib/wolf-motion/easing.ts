/*
==========================================================

WOLF MOTION

Easing Curves

==========================================================
*/

/*
Suave.

Para casi toda la aplicación.
*/

export const WOLF_EASE =

"cubic-bezier(.22,.61,.36,1)";

/*
Más rápido.

Botones.

Hover.

Sidebar.
*/

export const WOLF_FAST =

"cubic-bezier(.16,.84,.44,1)";

/*
Muy elegante.

Hero.

Gráficos.

Entrada de páginas.
*/

export const WOLF_HERO =

"cubic-bezier(.19,1,.22,1)";

/*
Aperturas.

Acordeones.

Modales.
*/

export const WOLF_EXPAND =

"cubic-bezier(.34,1.56,.64,1)";

/*
Muy suave.

Contadores.

Fade.

Carga.
*/

export const WOLF_SOFT =

"ease-out";

/*
==========================================================

Export agrupado

==========================================================
*/

export const WolfEasing = {

  default: WOLF_EASE,

  fast: WOLF_FAST,

  hero: WOLF_HERO,

  expand: WOLF_EXPAND,

  soft: WOLF_SOFT,

} as const;