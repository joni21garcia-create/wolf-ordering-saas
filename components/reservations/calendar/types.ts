/**
 * @deprecated Prefer ReservationCalendarEvent from "@/types/reservations".
 * Kept temporarily for legacy consumers.
 */
export interface CalendarReservation {
  id: string;
  title: string;
  start: string;
  end: string;
  guests: number;
  status: string;
}