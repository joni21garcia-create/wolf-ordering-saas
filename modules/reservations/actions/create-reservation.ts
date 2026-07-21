"use server";

import { reservationService } from "../services";
import type { CreateReservationDto } from "@/types/reservations";

export async function createReservation(
  data: CreateReservationDto
) {

  return reservationService.create(
    data
  );

}

