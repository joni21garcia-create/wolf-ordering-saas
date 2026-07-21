"use server";

import { availabilityService } from "../services";

export async function getAvailability(
  restaurantId:string,
  date:string
){

  return availabilityService.getAvailability(
    restaurantId,
    date
  );

}

