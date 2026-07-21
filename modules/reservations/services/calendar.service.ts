import { supabaseAdmin } from "@/lib/supabase/supabase";

export class CalendarService {

  /*
    Calendario por día
  */

  async getCalendar(
    restaurantId: string,
    date: string
  ) {

    const {
      data,
      error
    } =
    await supabaseAdmin
      .from(
        "restaurant_reservations"
      )
      .select(`
        id,
        customer_name,
        reservation_date,
        start_time,
        end_time,
        status,
        guests
      `)
      .eq(
        "restaurant_id",
        restaurantId
      )
      .eq(
        "reservation_date",
        date
      )
      .order(
        "start_time"
      );

    if (error) {

      throw error;

    }

    return (data ?? []).map(
      reservation =>
        this.toCalendarEvent(
          reservation
        )
    );

  }

  /*
    Alias para futuros módulos
  */

  async getEvents(
    restaurantId: string,
    date: string
  ) {

    return this.getCalendar(
      restaurantId,
      date
    );

  }

  /*
    Eventos del día
  */

  async getDailyCalendar(
    restaurantId: string,
    date: string
  ) {

    return this.getCalendar(
      restaurantId,
      date
    );

  }

  /*
    Mapper interno
  */

  private toCalendarEvent(
    reservation: any
  ) {

    return {

      id:
        reservation.id,

      title:
        reservation.customer_name,

      date:
        reservation.reservation_date,

      start:
        reservation.start_time,

      end:
        reservation.end_time,

      status:
        reservation.status,

      guests:
        reservation.guests,

      reservationId:
        reservation.id

    };

  }

}

export const calendarService =
  new CalendarService();

