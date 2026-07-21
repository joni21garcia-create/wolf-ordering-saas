import { supabaseAdmin } from "@/lib/supabase/supabase";

import {
  ReservationStatus
} from "@/types/reservations";

import type {
  CreateReservationDto,
  ReservationFilters,
  UpdateReservationDto
} from "@/types/reservations/reservation";

export class ReservationRepository {

  async create(
    data: CreateReservationDto
  ) {

    const startAt =
      `${data.datetime.date}T${data.datetime.startTime}:00`;

    const endAt =
      `${data.datetime.date}T${data.datetime.endTime}:00`;

    const {
      data: reservation,
      error
    } =
    await supabaseAdmin
      .from(
        "restaurant_reservations"
      )
      .insert({

        restaurant_id:
          data.restaurantId,

        confirmation_code:
          `RES-${Date.now()}`,

        reservation_number:
          `RES-${Date.now()}`,

        customer_name:
          data.guest.fullName,

        customer_email:
          data.guest.email ?? null,

        customer_phone:
          data.guest.phone,

        reservation_date:
          data.datetime.date,

        start_at:
          startAt,

        end_at:
          endAt,

        start_time:
          data.datetime.startTime,

        end_time:
          data.datetime.endTime,

        guests:
          data.capacity.guests,

        status:
          ReservationStatus.PENDING,

        source:
          "website",

        timezone:
          data.datetime.timezone ??
          "America/Guayaquil"

      })
      .select()
      .single();

    if (error) {

      console.error(
        "CREATE RESERVATION ERROR",
        error
      );

      throw error;

    }

    return reservation;

  }

  async findById(
    id: string
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
        *,
        restaurant_table_assignments(
          *,
          restaurant_tables(
            id,
            code,
            name,
            capacity
          )
        )
      `)
      .eq(
        "id",
        id
      )
      .single();

    if (error)
      throw error;

    return data;

  }

  async list(
    restaurantId: string,
    filters?: ReservationFilters
  ) {

    let query =
      supabaseAdmin
        .from(
          "restaurant_reservations"
        )
        .select(
          `
          *,
          restaurant_table_assignments(
            *,
            restaurant_tables(
              id,
              code,
              name,
              capacity
            )
          )
          `,
          {
            count: "exact"
          }
        )
        .eq(
          "restaurant_id",
          restaurantId
        )
        .neq(
          "status",
          ReservationStatus.CANCELLED
        );

    if (filters?.status) {

      query =
        query.eq(
          "status",
          filters.status
        );

    }

    if (filters?.date) {

      query =
        query.eq(
          "reservation_date",
          filters.date
        );

    }
        const {
      data,
      error,
      count
    } =
    await query;

    if (error)
      throw error;

    return {

      data:
        data ?? [],

      total:
        count ?? 0

    };

  }

  async update(
    id: string,
    values: UpdateReservationDto
  ) {

    const updateData = {} as Record<string, any>;

    if (
      values.status !== undefined
    ) {

      updateData.status =
        values.status;

      switch (
        values.status
      ) {

        case ReservationStatus.CONFIRMED:

          updateData.confirmed_at =
            new Date()
              .toISOString();

          break;

        case ReservationStatus.CANCELLED:

          updateData.cancelled_at =
            new Date()
              .toISOString();

          break;

        case ReservationStatus.CHECKED_IN:

          updateData.checked_in_at =
            new Date()
              .toISOString();

          break;

        case ReservationStatus.COMPLETED:

          updateData.completed_at =
            new Date()
              .toISOString();

          break;

      }

    }

    if (
      values.datetime
    ) {

      updateData.reservation_date =
        values.datetime.date;

      updateData.start_time =
        values.datetime.startTime;

      updateData.end_time =
        values.datetime.endTime;

      updateData.start_at =
        `${values.datetime.date}T${values.datetime.startTime}:00`;

      updateData.end_at =
        `${values.datetime.date}T${values.datetime.endTime}:00`;

      updateData.timezone =
        values.datetime.timezone;

    }

    if (
      values.capacity
    ) {

      updateData.guests =
        values.capacity.guests;

    }

    if (
      values.customerNotes !==
      undefined
    ) {

      updateData.notes =
        values.customerNotes;

    }

    if (
      values.internalNotes !==
      undefined
    ) {

      updateData.internal_notes =
        values.internalNotes;

    }

    updateData.updated_at =
      new Date()
        .toISOString();

    const {
      data,
      error
    } =
    await supabaseAdmin
      .from(
        "restaurant_reservations"
      )
      .update(
        updateData as never
      )
      .eq(
        "id",
        id
      )
      .select()
      .single();

    if (error)
      throw error;

    return data;

  }
    async confirm(
    id: string
  ) {

    return this.update(
      id,
      {
        status:
          ReservationStatus.CONFIRMED
      }
    );

  }

  async cancel(
    id: string
  ) {

    return this.update(
      id,
      {
        status:
          ReservationStatus.CANCELLED
      }
    );

  }

  async checkIn(
    id: string
  ) {

    return this.update(
      id,
      {
        status:
          ReservationStatus.CHECKED_IN
      }
    );

  }

  async complete(
    id: string
  ) {

    return this.update(
      id,
      {
        status:
          ReservationStatus.COMPLETED
      }
    );

  }

  async noShow(
    id: string
  ) {

    return this.update(
      id,
      {
        status:
          ReservationStatus.NO_SHOW
      }
    );

  }

  async delete(
    id: string
  ) {

    return this.cancel(
      id
    );

  }

}

export const reservationRepository =
  new ReservationRepository();