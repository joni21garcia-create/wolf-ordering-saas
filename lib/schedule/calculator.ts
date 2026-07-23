import {
  CLOSING_SOON_MINUTES,
  DAYS,
} from "./constants";

import {
  DayKey,
  RestaurantSchedule,
} from "./types";

import {
  crossesMidnight,
  getCurrentDay,
  getCurrentTime,
  getDaySchedule,
  getNextDay,
  hasSchedule,
  timeToMinutes,
} from "./helpers";

export interface CalculationResult {
  isOpen: boolean;

  isClosingSoon: boolean;

  currentDay: DayKey;

  currentOpen: string | null;

  currentClose: string | null;

  nextOpenDay: DayKey | null;

  nextOpenTime: string | null;

  opensToday: boolean;

  opensTomorrow: boolean;
}

export function calculateSchedule(
  schedule: RestaurantSchedule
): CalculationResult {

  const today =
    getCurrentDay();

  const now =
    timeToMinutes(
      getCurrentTime()
    );

  const todaySchedule =
    getDaySchedule(
      schedule,
      today
    );



  let isOpen = false;

  let isClosingSoon =
    false;

  let currentOpen:
    | string
    | null = null;

  let currentClose:
    | string
    | null = null;

  /**
   * Revisar horario de hoy
   */

  if (
    !isOpen &&
    todaySchedule.open &&
    todaySchedule.close
  ) {

    const open =
      timeToMinutes(
        todaySchedule.open
      );

    const close =
      timeToMinutes(
        todaySchedule.close
      );

    if (
      !crossesMidnight(
        todaySchedule.open,
        todaySchedule.close
      )
    ) {

      if (
        now >= open &&
        now < close
      ) {

        isOpen = true;

        currentOpen =
          todaySchedule.open;

        currentClose =
          todaySchedule.close;

        isClosingSoon =
          close - now <=
          CLOSING_SOON_MINUTES;
      }

    } else {

      if (
        now >= open
      ) {

        isOpen = true;

        currentOpen =
          todaySchedule.open;

        currentClose =
          todaySchedule.close;

        const minutesUntilMidnight =
          1440 - now;

        const totalRemaining =
          minutesUntilMidnight +
          close;

        isClosingSoon =
          totalRemaining <=
          CLOSING_SOON_MINUTES;
      }

    }

  }

  /**
   * Buscar siguiente apertura
   */

  let nextOpenDay:
    | DayKey
    | null = null;

  let nextOpenTime:
    | string
    | null = null;

  let opensToday =
    false;

  let opensTomorrow =
    false;

  if (!isOpen) {

    let searchDay =
      today;

    for (
      let i = 0;
      i < DAYS.length;
      i++
    ) {

      if (
        hasSchedule(
          schedule,
          searchDay
        )
      ) {

        const daySchedule =
          getDaySchedule(
            schedule,
            searchDay
          );

        const open =
          timeToMinutes(
            daySchedule.open!
          );

        if (
          i === 0 &&
          now < open
        ) {

          nextOpenDay =
            today;

          nextOpenTime =
            daySchedule.open;

          opensToday =
            true;

          break;
        }

        if (i > 0) {

          nextOpenDay =
            searchDay;

          nextOpenTime =
            daySchedule.open;

          if (i === 1)
            opensTomorrow =
              true;

          break;
        }

      }

      searchDay =
        getNextDay(
          searchDay
        );

    }

  }

  return {

    isOpen,

    isClosingSoon,

    currentDay: today,

    currentOpen,

    currentClose,

    nextOpenDay,

    nextOpenTime,

    opensToday,

    opensTomorrow,

  };

}
