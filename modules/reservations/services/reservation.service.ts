import {
  reservationRepository,
  availabilityRepository
} from "../repositories";

import {
  tableAssignmentService
} from "./table-assignment.service";

import type {
  CreateReservationDto,
  ReservationFilters,
  UpdateReservationDto
} from "@/types/reservations";

export class ReservationService {

  async create(
    data: CreateReservationDto
  ) {

    const startAt =
      `${data.datetime.date}T${data.datetime.startTime}:00`;

    const endAt =
      `${data.datetime.date}T${data.datetime.endTime}:00`;

    /*
      1.
      Buscar mesa disponible
    */

    const availability =
      await availabilityRepository.checkAvailability(
        data.restaurantId,
        startAt,
        endAt,
        data.capacity.guests
      );

    console.log(
      "RESERVATION AVAILABILITY",
      {
        restaurantId: data.restaurantId,
        startAt,
        endAt,
        guests: data.capacity.guests,
        available: availability.tables
      }
    );

    if (
      !availability.available ||
      availability.tables.length === 0
    ) {

      throw new Error(
        "No hay mesas disponibles para este horario"
      );

    }

    let reservation;

    try {

      /*
        2.
        Crear reserva
      */

      reservation =
        await reservationRepository.create(
          data
        );

      /*
        3.
        Seleccionar mesa
      */

      const assignedTable =
        availability.tables[0];

      /*
        4.
        Crear asignación
      */

      await tableAssignmentService.assign(
        reservation.id,
        assignedTable.id,
        data.capacity.guests
      );

      /*
        5.
        Devolver reserva completa
      */

      return await reservationRepository.findById(
        reservation.id
      );

    } catch (error) {

      /*
        Rollback
      */

      if (reservation?.id) {

        await reservationRepository.cancel(
          reservation.id
        );

      }

      console.error(
        "CREATE RESERVATION ROLLBACK",
        error
      );

      throw error;

    }

  }

  async get(
    id: string
  ) {

    return reservationRepository.findById(
      id
    );

  }

  async list(
    restaurantId: string,
    filters?: ReservationFilters
  ) {

    return reservationRepository.list(
      restaurantId,
      filters
    );

  }

  async update(
    id: string,
    values: UpdateReservationDto
  ) {

    return reservationRepository.update(
      id,
      values
    );

  }

  async confirm(
    id: string
  ) {

    return reservationRepository.confirm(
      id
    );

  }

  async cancel(
    id: string
  ) {

    return reservationRepository.cancel(
      id
    );

  }

  async checkIn(
    id: string
  ) {

    return reservationRepository.checkIn(
      id
    );

  }

  async complete(
    id: string
  ) {

    return reservationRepository.complete(
      id
    );

  }

  async noShow(
    id: string
  ) {

    return reservationRepository.noShow(
      id
    );

  }

  async remove(
    id: string
  ) {

    return reservationRepository.cancel(
      id
    );

  }

}

export const reservationService =
  new ReservationService();

