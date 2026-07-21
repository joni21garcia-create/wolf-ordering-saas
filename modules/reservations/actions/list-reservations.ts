"use server";

import { reservationService } from "../services";

import type {
  ReservationFilters,
} from "@/types/reservations";

export async function listReservations(
  restaurantId: string,
  filters?: ReservationFilters
) {

  return reservationService.list(
    restaurantId,
    filters
  );

}

