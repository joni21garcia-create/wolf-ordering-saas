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
 *
 * Si el restaurante no tiene horarios configurados,
 * devuelve un estado cerrado por defecto.
 */
export function getRestaurantStatus(
  schedule: RestaurantSchedule | null
): RestaurantStatusResult {

  if (!schedule) {
    return {
      status: "CLOSED",

      isOpen: false,

      isClosed: true,

      isClosingSoon: false,

      opensToday: false,

      opensTomorrow: false,

      currentDay: "monday",

      currentOpen: null,

      currentClose: null,

      nextOpenDay: null,

      nextOpenTime: null,

      badge: "Cerrado",

      message: "No hay horarios disponibles.",

      schedule: "",
    };
  }

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