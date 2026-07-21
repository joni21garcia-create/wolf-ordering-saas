"use server";

import {
  statisticsService,
} from "../services";

export async function getReservationStatistics(
  restaurantId: string,
) {
  return statisticsService.getRestaurantStatistics(
    restaurantId,
  );
}