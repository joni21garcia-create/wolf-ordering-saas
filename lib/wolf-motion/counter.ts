import {
  useEffect,
  useRef,
  useState,
} from "react";

import { WOLF_TIMING } from "./timing";

/*
==========================================================

WOLF COUNTER

==========================================================
*/

interface CounterOptions {

  duration?: number;

  decimals?: number;

}

export function useWolfCounter(

  value: number,

  {

    duration = WOLF_TIMING.hero,

    decimals = 2,

  }: CounterOptions = {}

) {

  const [display, setDisplay] =
    useState(value);

const frame =
  useRef<number | null>(null);

  useEffect(() => {

if (frame.current !== null) {

  cancelAnimationFrame(
    frame.current
  );

}

    const start =
      performance.now();

    const from =
      display;

    const to =
      value;

    const animate = (

      now: number

    ) => {

      const progress =
        Math.min(
          (now - start) /
            duration,
          1
        );

      /*
      Ease Out Cubic
      */

      const eased =

        1 -

        Math.pow(

          1 - progress,

          3

        );

      const current =

        from +

        (to - from) *

          eased;

      setDisplay(

        Number(

          current.toFixed(

            decimals

          )

        )

      );

      if (

        progress < 1

      ) {

        frame.current =

          requestAnimationFrame(

            animate

          );

      }

    };

    frame.current =

      requestAnimationFrame(

        animate

      );

return () => {

  if (frame.current !== null) {

    cancelAnimationFrame(
      frame.current
    );

  }

};

  }, [

    value,

    duration,

    decimals,

  ]);

  return display;

}

/*
==========================================================

INTEGER

==========================================================
*/

export function useWolfInteger(

  value: number,

  duration =

    WOLF_TIMING.hero

) {

  return useWolfCounter(

    value,

    {

      duration,

      decimals: 0,

    }

  );

}