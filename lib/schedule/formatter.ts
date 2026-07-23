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

  /**
   * Restaurante abierto
   */

  if (result.isOpen) {

    return {

      badge: result.isClosingSoon
        ? "Próximo a cerrar"
        : "Abierto",

      message: result.isClosingSoon
        ? "⚠️ ¡CIERRA PRONTO!"
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

  /**
   * Abre hoy
   */

  if (
    result.opensToday &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message: `Abre hoy a las ${formatTime12(
        result.nextOpenTime
      )}`,

      schedule: "",

    };

  }

  /**
   * Abre mañana
   */

  if (
    result.opensTomorrow &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message: `Abre mañana a las ${formatTime12(
        result.nextOpenTime
      )}`,

      schedule: "",

    };

  }

  /**
   * Otro día
   */

  if (
    result.nextOpenDay &&
    result.nextOpenTime
  ) {

    return {

      badge: "Cerrado",

      message: `Abre ${DAY_LABELS[
        result.nextOpenDay
      ]} a las ${formatTime12(
        result.nextOpenTime
      )}`,

      schedule: "",

    };

  }

  /**
   * Sin horarios
   */

  return {

    badge: "Cerrado",

    message:
      "No hay horarios disponibles.",

    schedule: "",

  };

}
