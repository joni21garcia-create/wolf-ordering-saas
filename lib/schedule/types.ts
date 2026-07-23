export type DayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type RestaurantStatus =
  | "OPEN"
  | "CLOSED";

export interface DailySchedule {
  day: DayKey;
  open: string | null;
  close: string | null;
}

export interface RestaurantSchedule {
  sunday_open: string | null;
  sunday_close: string | null;

  monday_open: string | null;
  monday_close: string | null;

  tuesday_open: string | null;
  tuesday_close: string | null;

  wednesday_open: string | null;
  wednesday_close: string | null;

  thursday_open: string | null;
  thursday_close: string | null;

  friday_open: string | null;
  friday_close: string | null;

  saturday_open: string | null;
  saturday_close: string | null;
}

export interface RestaurantStatusResult {
  status: RestaurantStatus;

  isOpen: boolean;

  isClosed: boolean;

  isClosingSoon: boolean;

  opensToday: boolean;

  opensTomorrow: boolean;

  currentDay: DayKey;

  currentOpen: string | null;

  currentClose: string | null;

  nextOpenDay: DayKey | null;

  nextOpenTime: string | null;

  badge: string;

  message: string;

  schedule: string;
}
