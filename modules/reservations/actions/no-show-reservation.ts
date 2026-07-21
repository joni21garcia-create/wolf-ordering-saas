"use server";

import { reservationService } from "../services";
import { ReservationStatus } from "@/types/reservations";

export async function noShowReservation(
  id: string
) {

  return reservationService.update(
    id,
    {
      status: ReservationStatus.NO_SHOW
    }
  );

}

