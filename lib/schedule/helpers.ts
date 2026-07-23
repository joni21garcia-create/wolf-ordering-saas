import {
  DAYS,
  DAY_LABELS,
  TIMEZONE,
} from "./constants";

import {
  DayKey,
  RestaurantSchedule,
} from "./types";

/**
 * Convierte "14:30" -> 870
 */
export function timeToMinutes(
  time: string
): number {
  const [hour, minute] =
    time.split(":").map(Number);

  return hour * 60 + minute;
}

/**
 * Convierte 870 -> "14:30"
 */
export function minutesToTime(
  minutes: number
): string {
  const h = Math.floor(
    minutes / 60
  )
    .toString()
    .padStart(2, "0");

  const m = (minutes % 60)
    .toString()
    .padStart(2, "0");

  return `${h}:${m}`;
}

/**
 * 24h -> 12h
 * 14:30 -> 2:30 PM
 */
export function formatTime12(
  time: string | null
): string {
  if (!time) return "";

  const [hour, minute] =
    time.split(":").map(Number);

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }
  ).format(date);
}

/**
 * Hora actual Ecuador
 */
export function getCurrentTime() {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(new Date());

}

/**
 * Día actual
 */
export function getCurrentDay(): DayKey {
  const day =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: TIMEZONE,
        weekday: "long",
      }
    ).format(new Date());


return {
    Sunday: "sunday",
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
  }[day] as DayKey;
}

/**
 * Día anterior
 */
export function getPreviousDay(
  day: DayKey
): DayKey {
  const index =
    DAYS.indexOf(day);

  return DAYS[
    (index + 6) % 7
  ];
}

/**
 * Día siguiente
 */
export function getNextDay(
  day: DayKey
): DayKey {
  const index =
    DAYS.indexOf(day);

  return DAYS[
    (index + 1) % 7
  ];
}

/**
 * ¿Cruza medianoche?
 */
export function crossesMidnight(
  open: string,
  close: string
): boolean {
  return (
    timeToMinutes(close) <=
    timeToMinutes(open)
  );
}

/**
 * Obtiene horario de un día
 */
export function getDaySchedule(
  schedule: RestaurantSchedule,
  day: DayKey
) {

return {
    open:
      schedule[
        `${day}_open`
      ] ?? null,

    close:
      schedule[
        `${day}_close`
      ] ?? null,
  };
}

/**
 * ¿Tiene horario?
 */
export function hasSchedule(
  schedule: RestaurantSchedule,
  day: DayKey
): boolean {
  const data =
    getDaySchedule(
      schedule,
      day
    );

  return !!(
    data.open &&
    data.close
  );
}

/**
 * Nombre del día en español
 */
export function getDayLabel(
  day: DayKey
) {
  return DAY_LABELS[day];
}

