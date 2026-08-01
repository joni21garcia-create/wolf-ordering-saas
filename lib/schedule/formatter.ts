import {
  DAY_LABELS,
} from "./constants";

import {
  formatTime12,
} from "./helpers";

import {
  CalculationResult,
} from "./calculator";

export interface FormattedStatus {

  badge: string;

  message: string;

  schedule: string;

}

export function formatStatus(
  result: CalculationResult
): FormattedStatus {

  /*
  ==========================================================
  RESTAURANTE ABIERTO
  ==========================================================
  */

  if (result.isOpen) {

    return {

      badge:
        result.isClosingSoon
          ? "Próximo a cerrar"
          : "Abierto",

      message:
        result.currentClose
          ? `Cierra a las ${formatTime12(
              result.currentClose
            )}`
          : "Abierto",

      schedule:
        result.currentOpen &&
        result.currentClose
          ? `Hoy ${formatTime12(
              result.currentOpen
            )} - ${formatTime12(
              result.currentClose
            )}`
          : "",

    };

  }

  /*
  ==========================================================
  ABRE HOY
  ==========================================================
  */

  if (
    result.opensToday &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message:
        `Abre hoy a las ${formatTime12(
          result.nextOpenTime
        )}`,

      schedule: "",

    };

  }

  /*
  ==========================================================
  ABRE MAÑANA
  ==========================================================
  */

  if (
    result.opensTomorrow &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message:
        `Abre mañana a las ${formatTime12(
          result.nextOpenTime
        )}`,

      schedule: "",

    };

  }

  /*
  ==========================================================
  ABRE OTRO DÍA
  ==========================================================
  */

  if (
    result.nextOpenDay &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message:
        `Abre ${DAY_LABELS[
          result.nextOpenDay
        ]} a las ${formatTime12(
          result.nextOpenTime
        )}`,

      schedule: "",

    };

  }

  /*
  ==========================================================
  SIN HORARIOS
  ==========================================================
  */

  return {

    badge: "Cerrado",

    message:
      "Horario no configurado.",

    schedule: "",

  };

}