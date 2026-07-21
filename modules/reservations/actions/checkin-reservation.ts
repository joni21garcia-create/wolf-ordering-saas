"use server";

import { reservationService } from "../services";
import { ReservationStatus } from "@/types/reservations";

export async function checkinReservation(
  id: string
) {
  return reservationService.update(id, {
    status: ReservationStatus.CHECKED_IN,
  });
}
