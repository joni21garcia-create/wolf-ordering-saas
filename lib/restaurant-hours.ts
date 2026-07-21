const TIMEZONE = "America/Guayaquil";

export function getCurrentDayKey() {
  const day =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: TIMEZONE,
        weekday: "long",
      }
    ).format(new Date());


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


export function isRestaurantOpen(
  schedule: any
) {
  if (!schedule) return false;


  const dayKey =
    getCurrentDayKey();


  const open =
    schedule[
      `${dayKey}_open`
    ];


  const close =
    schedule[
      `${dayKey}_close`
    ];


  if (!open || !close) {
    return false;
  }


  const currentTime =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }
    )
    .format(new Date());


  return (
    currentTime >= open &&
    currentTime <= close
  );
}


