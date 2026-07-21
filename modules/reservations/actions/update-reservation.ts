"use server";

import { reservationService } from "../services";

import type {
  UpdateReservationDto,
} from "@/types/reservations";

export async function updateReservation(
  id: string,
  data: UpdateReservationDto
) {

  return reservationService.update(
    id,
    data
  );

}

