"use server";

import { calendarService } from "@/modules/reservations/services/calendar.service";

export async function getReservationCalendar(
  restaurantId:string,
  date:string
){

  return calendarService.getCalendar(
    restaurantId,
    date
  );

}

