import {
  RestaurantSchedule,
  RestaurantStatusResult,
} from "./types";

import {
  calculateSchedule,
} from "./calculator";

import {
  formatStatus,
} from "./formatter";

/**
 * API pública del motor.
 *
 * Toda la aplicación deberá utilizar únicamente esta función.
 */
export function getRestaurantStatus(
  schedule: RestaurantSchedule
): RestaurantStatusResult {


const calculation =
    calculateSchedule(schedule);


const formatted =
    formatStatus(calculation);

  return {

    status:
      calculation.isOpen
        ? "OPEN"
        : "CLOSED",

    isOpen:
      calculation.isOpen,

    isClosed:
      !calculation.isOpen,

    isClosingSoon:
      calculation.isClosingSoon,

    opensToday:
      calculation.opensToday,

    opensTomorrow:
      calculation.opensTomorrow,

    currentDay:
      calculation.currentDay,

    currentOpen:
      calculation.currentOpen,

    currentClose:
      calculation.currentClose,

    nextOpenDay:
      calculation.nextOpenDay,

    nextOpenTime:
      calculation.nextOpenTime,

    badge:
      formatted.badge,

    message:
      formatted.message,

    schedule:
      formatted.schedule,

  };

}
