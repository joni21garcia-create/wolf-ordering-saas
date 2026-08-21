import {
  reservationRepository,
} from "../repositories";

import type {
  CreateReservationDto,
  ReservationFilters,
  UpdateReservationDto,
} from "@/types/reservations";

export class ReservationService {

  async create(
    data: CreateReservationDto
  ) {
    /*
     * La creación completa de la reserva se centraliza
     * en ReservationRepository.
     *
     * ReservationRepository se encarga de:
     *
     * - convertir la fecha/hora local a UTC;
     * - respetar America/Guayaquil;
     * - validar horario del restaurante;
     * - validar anticipación;
     * - validar bloqueos;
     * - comprobar disponibilidad real;
     * - resolver una mesa individual;
     * - resolver combinación de mesas;
     * - crear la reserva;
     * - crear las asignaciones;
     * - registrar los logs.
     *
     * No hacemos una segunda validación aquí porque
     * produciría diferencias entre la hora local del
     * restaurante y los timestamps UTC.
     */
    return reservationRepository.create(
      data
    );
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