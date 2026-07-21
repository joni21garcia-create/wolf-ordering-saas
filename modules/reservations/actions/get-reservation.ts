"use server";

import { reservationService } from "../services";

export async function getReservation(
  id: string
) {

  return reservationService.get(
    id
  );

}

