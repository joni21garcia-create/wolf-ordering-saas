const TIMEZONE = "America/Guayaquil";

export function getCurrentDayKey() {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
  }).format(new Date());

  const days: Record<string, string> = {
    Sunday: "sunday",
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
  };

  return days[day];
}

export function isRestaurantOpen(schedule: any) {
  // Si no hay configuración, dejar abierto
  if (!schedule) return true;

  const dayKey = getCurrentDayKey();

  const open = schedule[`${dayKey}_open`];
  const close = schedule[`${dayKey}_close`];

  // Día cerrado
  if (!open || !close) {
    return false;
  }

  const currentTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  // Horario normal (ej. 08:00 -> 18:00)
  if (open <= close) {
    return currentTime >= open && currentTime <= close;
  }

  // Horario que cruza la medianoche (ej. 12:00 -> 02:00)
  return currentTime >= open || currentTime <= close;
}

