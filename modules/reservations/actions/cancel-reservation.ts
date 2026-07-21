"use server";

import { reservationService } from "../services";

export async function cancelReservation(
  id: string
) {
  return reservationService.cancel(id);
}
