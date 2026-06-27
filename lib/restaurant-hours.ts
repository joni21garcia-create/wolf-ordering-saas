export function getCurrentDayKey() {
  const day = new Date().getDay();

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  return days[day];
}

export function isRestaurantOpen(
  schedule: any
) {
  if (!schedule) return true;

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

  const now =
    new Date();

  const currentTime =
    now
      .toTimeString()
      .slice(0, 5);

  return (
    currentTime >= open &&
    currentTime <= close
  );
}