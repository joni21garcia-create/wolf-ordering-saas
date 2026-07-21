"use server";

import { reservationService } from "../services";
import { ReservationStatus } from "@/types/reservations";

export async function completeReservation(
  id: string
) {

  return reservationService.update(
    id,
    {
      status: ReservationStatus.COMPLETED
    }
  );

}

