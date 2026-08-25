import { supabaseAdmin } from "@/lib/supabase/supabase";

import {
  ReservationStatus,
} from "@/types/reservations";

import type {
  CreateReservationDto,
  ReservationFilters,
  UpdateReservationDto,
} from "@/types/reservations/reservation";

import {
  availabilityRepository,
} from "./availability.repository";

import {
  tableCombinationService,
} from "../services/TableCombinationService";

import {
  settingsRepository,
  type ReservationPolicy,
} from "./settings.repository";

export class ReservationRepository {

  private async resolveAssignedTables(
    restaurantId: string,
    startAt: string,
    endAt: string,
    guests: number,
    _excludeReservationId?: string,
  ) {
    const availability =
      await availabilityRepository.checkAvailability(
        restaurantId,
        startAt,
        endAt,
        guests,
       
      );

    if (availability.available && availability.table) {
      return [availability.table];
    }

    if (availability.available && availability.tables.length > 0) {
      return availability.tables;
    }

    throw new Error(availability.reason ?? "NO_TABLE_AVAILABLE");
  }

  private localDateTimeToUtcIso(
    date: string,
    time: string,
    timezone: string
  ): string {
    const [hours, minutes, seconds = "00"] = time.split(":");

    const naiveUtc = new Date(
      `${date}T${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}Z`
    );

    if (Number.isNaN(naiveUtc.getTime())) {
      throw new Error("INVALID_RESERVATION_DATETIME");
    }

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });

    const parts = Object.fromEntries(
      formatter
        .formatToParts(naiveUtc)
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value])
    ) as Record<string, string>;

    const representedInUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second)
    );

    const timezoneOffsetMs =
      representedInUtc - naiveUtc.getTime();

    return new Date(
      naiveUtc.getTime() - timezoneOffsetMs
    ).toISOString();
  }

  private async getReservationPolicy(restaurantId: string): Promise<ReservationPolicy> {
    return settingsRepository.getPolicy(restaurantId);
  }

  private validateCustomerData(
    data: CreateReservationDto,
    policy: ReservationPolicy,
  ): void {
    const guests = data.capacity?.guests;

    if (!Number.isInteger(guests) || guests <= 0) {
      throw new Error("INVALID_GUEST_COUNT");
    }

    if (guests < policy.minGuestsPerReservation) {
      throw new Error("GUEST_COUNT_BELOW_MINIMUM");
    }

    if (guests > policy.maxGuestsPerReservation) {
      throw new Error("GUEST_COUNT_ABOVE_MAXIMUM");
    }

    if (!data.guest?.fullName?.trim()) {
      throw new Error("CUSTOMER_NAME_REQUIRED");
    }

    if (policy.requirePhone && !data.guest?.phone?.trim()) {
      throw new Error("CUSTOMER_PHONE_REQUIRED");
    }

    if (policy.requireEmail && !data.guest?.email?.trim()) {
      throw new Error("CUSTOMER_EMAIL_REQUIRED");
    }
  }

  async create(data: CreateReservationDto) {
    const policy = await this.getReservationPolicy(data.restaurantId);

    if (!policy.reservationsEnabled) {
      throw new Error("RESERVATIONS_DISABLED");
    }

    this.validateCustomerData(data, policy);

    const timezone =
      policy.timezone ||
      data.datetime.timezone ||
      "America/Guayaquil";

    if (
      data.datetime.timezone &&
      data.datetime.timezone !== timezone
    ) {
      throw new Error("INVALID_TIMEZONE");
    }

    const startAt =
      this.localDateTimeToUtcIso(
        data.datetime.date,
        data.datetime.startTime,
        timezone
      );

    const endAt =
      this.localDateTimeToUtcIso(
        data.datetime.date,
        data.datetime.endTime,
        timezone
      );

    const scheduleIsValid =
      await availabilityRepository.validateReservationInterval(
        data.restaurantId,
        data.datetime.date,
        data.datetime.startTime,
        data.datetime.endTime,
      );

    if (!scheduleIsValid) {
      throw new Error("INVALID_RESERVATION_INTERVAL");
    }

    /*
     * restaurant_reservations no tiene columnas type_id/service_id.
     * Esos datos viven en metadata y se vuelven a exponer mediante
     * el mapper.
     *
     * No usamos occasion como sustituto de ambos: son conceptos
     * distintos y no debemos perder información.
     */
    const reservationMetadata: Record<string, unknown> = {
      reservation_type_id:
        data.typeId?.trim() || null,
      reservation_type_name:
        data.typeName?.trim() || null,
      service_id:
        data.serviceId?.trim() || null,
      service_name:
        data.serviceName?.trim() || null,
    };

    const customerNotes =
      data.customerNotes?.trim() ||
      data.guest.notes?.trim() ||
      null;

    /*
     * La disponibilidad se comprueba antes de crear la reserva, pero esa
     * comprobación por sí sola no elimina una condición de carrera:
     *
     *   A comprueba -> mesa libre
     *   B comprueba -> mesa libre
     *   A asigna
     *   B intenta asignar -> conflicto
     *
     * La migración de concurrencia de PostgreSQL protege el INSERT final y
     * devuelve TABLE_ASSIGNMENT_CONFLICT cuando eso ocurre.
     *
     * No eliminamos esa protección. Si aparece el conflicto, limpiamos la
     * reserva provisional y volvemos a consultar disponibilidad. Así un
     * conflicto esperado de concurrencia no termina como un error genérico
     * de Server Components para el cliente.
     *
     * Dos reintentos, además del intento inicial, son suficientes para cubrir
     * una carrera puntual sin crear un bucle infinito ni generar carga
     * innecesaria sobre Supabase.
     */
    const MAX_ASSIGNMENT_RETRIES = 2;

    for (
      let attempt = 0;
      attempt <= MAX_ASSIGNMENT_RETRIES;
      attempt += 1
    ) {
      const assignedTables =
        await this.resolveAssignedTables(
          data.restaurantId,
          startAt,
          endAt,
          data.capacity.guests
        );

      const uniqueSuffix = Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

      const timestamp = Date.now();

      const confirmationCode =
        `RES-${timestamp}-${uniqueSuffix}`;

      const reservationNumber =
        `RES-${timestamp}-${uniqueSuffix}`;

      const {
        data: reservation,
        error: reservationError,
      } = await supabaseAdmin
        .from("restaurant_reservations")
        .insert({
          restaurant_id: data.restaurantId,
          confirmation_code: confirmationCode,
          reservation_number: reservationNumber,
          customer_name: data.guest.fullName,
          customer_email: data.guest.email ?? null,
          customer_phone: data.guest.phone,
          reservation_date: data.datetime.date,
          start_at: startAt,
          end_at: endAt,
          start_time: data.datetime.startTime,
          end_time: data.datetime.endTime,
          guests: data.capacity.guests,
          // La configuración del restaurante define el estado inicial:
          // - autoConfirm=true  -> CONFIRMED
          // - autoConfirm=false -> PENDING
          status: policy.autoConfirm
            ? ReservationStatus.CONFIRMED
            : ReservationStatus.PENDING,
          confirmed_at: policy.autoConfirm
            ? new Date().toISOString()
            : null,
          source: "website",
          timezone:
            data.datetime.timezone ?? "America/Guayaquil",
          occasion:
            data.serviceName?.trim() || null,
          notes: customerNotes,
          // La columna existe en Supabase; el database.types.ts local todavía
          // no la declara. El cast mantiene el payload real sin cambiar la
          // estructura de la tabla.
          customer_notes: customerNotes as never,
          metadata: reservationMetadata as never,
        })
        .select()
        .single();

      if (reservationError) {
        console.error(
          "CREATE RESERVATION ERROR",
          reservationError
        );
        throw reservationError;
      }

      let remainingGuests = data.capacity.guests;

      const assignments = assignedTables.map(
        (table, index) => {
          const assignedGuests =
            index === assignedTables.length - 1
              ? remainingGuests
              : Math.min(
                  table.capacity,
                  remainingGuests
                );

          remainingGuests -= assignedGuests;

          return {
            reservation_id: reservation.id,
            table_id: table.id,
            assigned_guests: assignedGuests,
            is_primary: index === 0,
            notes:
              assignedTables.length > 1
                ? "Asignación automática por combinación de mesas"
                : "Asignación automática",
          };
        }
      );

      const {
        error: assignmentError,
      } = await supabaseAdmin
        .from("restaurant_table_assignments")
        .insert(assignments);

      if (!assignmentError) {
        await this.createLog({
          reservationId: reservation.id,
          restaurantId: data.restaurantId,
          action: "created",
          newStatus: reservation.status,
          message: "Reserva creada correctamente.",
          metadata: {
            source: "website",
          },
        });

        await this.createLog({
          reservationId: reservation.id,
          restaurantId: data.restaurantId,
          action: "table_assigned",
          message:
            assignedTables.length > 1
              ? "Mesas combinadas asignadas automáticamente."
              : "Mesa asignada automáticamente.",
          metadata: {
            tableIds: assignedTables.map(
              (table) => table.id
            ),
            tableCodes: assignedTables.map(
              (table) => table.code
            ),
            tableCount: assignedTables.length,
            guests: data.capacity.guests,
          },
        });

        return reservation;
      }

      /*
       * El INSERT de asignaciones es una sola operación. PostgreSQL revierte
       * la operación completa si el trigger detecta un conflicto, pero
       * limpiamos explícitamente por reservation_id antes de reintentar para
       * mantener el flujo seguro incluso si la implementación de la tabla
       * cambia en el futuro.
       */
      const isTableAssignmentConflict =
        assignmentError.code === "23P01" &&
        assignmentError.message?.includes(
          "TABLE_ASSIGNMENT_CONFLICT"
        );

      const { error: cleanupAssignmentsError } =
        await supabaseAdmin
          .from("restaurant_table_assignments")
          .delete()
          .eq("reservation_id", reservation.id);

      if (cleanupAssignmentsError) {
        console.error(
          "CLEANUP TABLE ASSIGNMENTS AFTER RESERVATION FAILURE ERROR",
          {
            reservationId: reservation.id,
            assignmentError,
            cleanupAssignmentsError,
          }
        );

        // No seguimos reintentando si no podemos garantizar que la reserva
        // provisional quedó limpia.
        throw new Error(
          "RESERVATION_CLEANUP_FAILED"
        );
      }

      const { error: cleanupReservationError } =
        await supabaseAdmin
          .from("restaurant_reservations")
          .delete()
          .eq("id", reservation.id);

      if (cleanupReservationError) {
        console.error(
          "CLEANUP RESERVATION AFTER TABLE ASSIGNMENT ERROR",
          {
            reservationId: reservation.id,
            assignmentError,
            cleanupReservationError,
          }
        );

        // No seguimos reintentando si la reserva provisional no pudo
        // eliminarse. Esto evita crear otra reserva encima de un posible
        // registro huérfano.
        throw new Error(
          "RESERVATION_CLEANUP_FAILED"
        );
      }

      console.error(
        "CREATE TABLE ASSIGNMENT ERROR",
        {
          attempt: attempt + 1,
          maxAttempts: MAX_ASSIGNMENT_RETRIES + 1,
          assignmentError,
        }
      );

      if (!isTableAssignmentConflict) {
        // Es un error real de base de datos y no una carrera esperada.
        throw assignmentError;
      }

      if (attempt >= MAX_ASSIGNMENT_RETRIES) {
        // La carrera se mantuvo durante todos los intentos. Devolvemos un
        // código de dominio estable en lugar de propagar el mensaje interno
        // del trigger de PostgreSQL al cliente.
        throw new Error(
          "RESERVATION_TEMPORARILY_UNAVAILABLE"
        );
      }

      console.warn(
        "TABLE ASSIGNMENT CONFLICT - RETRYING RESERVATION",
        {
          attempt: attempt + 1,
          nextAttempt: attempt + 2,
        }
      );
    }

    // El bucle siempre retorna o lanza, pero mantenemos un guard defensivo.
    throw new Error("RESERVATION_CREATION_FAILED");
  }

  async findById(id: string) {
    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("restaurant_reservations")
        .select(`
          *,
          restaurant_table_assignments(
            *,
            restaurant_tables(
              id,
              code,
              name,
              capacity,
              min_capacity,
              max_capacity,
              joinable
            )
          )
        `)
        .eq("id", id)
        .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async list(
    restaurantId: string,
    filters?: ReservationFilters
  ) {
    let query =
      supabaseAdmin
        .from("restaurant_reservations")
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
            count: "exact",
          }
        )
        .eq("restaurant_id", restaurantId);

    if (filters?.status) {
      query =
        query.eq("status", filters.status);
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
      count,
    } = await query;

    if (error) {
      throw error;
    }

    let results = data ?? [];

    const search =
      (filters as any)?.search
        ?.trim()
        .toLowerCase();

    const minGuests =
      (filters as any)?.minGuests;

    if (search) {
      results =
        results.filter(
          (reservation) =>
            reservation.customer_name
              ?.toLowerCase()
              .includes(search) ||
            reservation.customer_phone
              ?.toLowerCase()
              .includes(search) ||
            reservation.customer_email
              ?.toLowerCase()
              .includes(search)
        );
    }

    if (
      minGuests !== undefined &&
      minGuests !== null
    ) {
      results =
        results.filter(
          (reservation) =>
            Number(reservation.guests) >=
            Number(minGuests)
        );
    }

    return {
      data: results,
      total:
        search || minGuests !== undefined
          ? results.length
          : count ?? 0,
    };
  }

  private isValidStatusTransition(
    currentStatus: ReservationStatus,
    nextStatus: ReservationStatus
  ): boolean {
    if (currentStatus === nextStatus) {
      return true;
    }

const transitions: Record<
  ReservationStatus,
  ReservationStatus[]
> = {
  [ReservationStatus.PENDING]: [
    ReservationStatus.CONFIRMED,
    ReservationStatus.CANCELLED,
    ReservationStatus.REJECTED,
    ReservationStatus.EXPIRED,
  ],

  [ReservationStatus.CONFIRMED]: [
    ReservationStatus.CHECKED_IN,
    ReservationStatus.CANCELLED,
    ReservationStatus.NO_SHOW,
  ],

  [ReservationStatus.CHECKED_IN]: [
    ReservationStatus.COMPLETED,
    ReservationStatus.CANCELLED,
  ],

  [ReservationStatus.COMPLETED]: [],

  [ReservationStatus.CANCELLED]: [],

  [ReservationStatus.NO_SHOW]: [],

  [ReservationStatus.REJECTED]: [],

  [ReservationStatus.EXPIRED]: [],
};

    return transitions[currentStatus]?.includes(nextStatus) ?? false;
  }

  private shouldReleaseTables(
    status: ReservationStatus
  ): boolean {
    return [
      ReservationStatus.COMPLETED,
      ReservationStatus.CANCELLED,
      ReservationStatus.NO_SHOW,
    ].includes(status);
  }

  private async releaseAssignments(
    reservationId: string,
    restaurantId: string,
    previousStatus: ReservationStatus,
    newStatus: ReservationStatus
  ): Promise<void> {
    const { error } = await supabaseAdmin
      .from("restaurant_table_assignments")
      .delete()
      .eq("reservation_id", reservationId);

    if (error) {
      throw error;
    }

    await this.createLog({
      reservationId,
      restaurantId,
      action: "table_removed",
      previousStatus,
      newStatus,
      message:
        newStatus === ReservationStatus.NO_SHOW
          ? "Mesa liberada por no-show."
          : newStatus === ReservationStatus.COMPLETED
            ? "Mesa liberada al completar la reserva."
            : "Mesa liberada por cancelación.",
    });
  }

  async update(
    id: string,
    values: UpdateReservationDto
  ) {
    const current =
      await this.findById(id);

    if (!current) {
      throw new Error(
        "RESERVATION_NOT_FOUND"
      );
    }

    const policy = await this.getReservationPolicy(current.restaurant_id);

    if (values.capacity?.guests !== undefined) {
      if (values.capacity.guests < policy.minGuestsPerReservation) {
        throw new Error("GUEST_COUNT_BELOW_MINIMUM");
      }
      if (values.capacity.guests > policy.maxGuestsPerReservation) {
        throw new Error("GUEST_COUNT_ABOVE_MAXIMUM");
      }
    }

    if (
      values.status !== undefined &&
      !this.isValidStatusTransition(
        current.status as ReservationStatus,
        values.status
      )
    ) {
      throw new Error(
        `INVALID_STATUS_TRANSITION:${current.status}->${values.status}`
      );
    }

    const updateData:
      Record<string, any> = {};

    let nextStart =
      current.start_at;

    let nextEnd =
      current.end_at;

    let nextGuests =
      current.guests;

    if (values.status !== undefined) {
      updateData.status =
        values.status;

      switch (values.status) {
        case ReservationStatus.CONFIRMED:
          updateData.confirmed_at =
            new Date().toISOString();
          break;

        case ReservationStatus.CANCELLED:
          updateData.cancelled_at =
            new Date().toISOString();
          break;

        case ReservationStatus.CHECKED_IN:
          updateData.checked_in_at =
            new Date().toISOString();
          break;

        case ReservationStatus.COMPLETED:
          updateData.completed_at =
            new Date().toISOString();
          break;
      }
    }

    if (values.datetime) {
      const timezone =
        values.datetime.timezone ??
        current.timezone ??
        policy.timezone;

      if (timezone !== policy.timezone) {
        throw new Error("INVALID_TIMEZONE");
      }

      nextStart =
        this.localDateTimeToUtcIso(
          values.datetime.date,
          values.datetime.startTime,
          timezone
        );

      nextEnd =
        this.localDateTimeToUtcIso(
          values.datetime.date,
          values.datetime.endTime,
          timezone
        );

      updateData.reservation_date =
        values.datetime.date;

      updateData.start_time =
        values.datetime.startTime;

      updateData.end_time =
        values.datetime.endTime;

      updateData.start_at =
        nextStart;

      updateData.end_at =
        nextEnd;

      updateData.timezone =
        timezone;

      const scheduleIsValid =
        await availabilityRepository.validateReservationInterval(
          current.restaurant_id,
          values.datetime.date,
          values.datetime.startTime,
          values.datetime.endTime,
        );

      if (!scheduleIsValid) {
        throw new Error("INVALID_RESERVATION_INTERVAL");
      }
    }

    if (values.capacity) {
      nextGuests =
        values.capacity.guests;

      updateData.guests =
        nextGuests;
    }

    const scheduleChanged =
      values.datetime !== undefined ||
      values.capacity !== undefined;

    if (
      scheduleChanged &&
      current.status !==
        ReservationStatus.CANCELLED
    ) {
      const assignedTables =
        await this.resolveAssignedTables(
          current.restaurant_id,
          nextStart,
          nextEnd,
          nextGuests,
          id
        );

      await this.replaceAssignments(
        id,
        assignedTables,
        nextGuests
      );
    }

    if (
      values.customerNotes !== undefined
    ) {
      const customerNotes =
        values.customerNotes.trim() ||
        null;

      /*
       * `customer_notes` es la columna semántica
       * para notas del cliente. `notes` se mantiene
       * sincronizada por compatibilidad con el
       * código existente que todavía la consume.
       */
      updateData.customer_notes =
        customerNotes;

      updateData.notes =
        customerNotes;
    }

    if (
      values.internalNotes !== undefined
    ) {
      updateData.internal_notes =
        values.internalNotes;
    }

    updateData.updated_at =
      new Date().toISOString();

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from("restaurant_reservations")
        .update(updateData as never)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    await this.createLog({
      reservationId: id,
      restaurantId: current.restaurant_id,
      action:
        values.status !== undefined
          ? this.statusToLogAction(
              values.status
            )
          : "updated",
      previousStatus: current.status,
      newStatus: data.status,
      message: "Reserva actualizada.",
    });

    if (
      values.status !== undefined &&
      this.shouldReleaseTables(
        values.status
      ) &&
      current.status !== values.status
    ) {
      await this.releaseAssignments(
        id,
        current.restaurant_id,
        current.status as ReservationStatus,
        values.status
      );
    }

    return data;
  }

  private async replaceAssignments(
    reservationId: string,
    tables: Array<{
      id: string;
      code: string;
      capacity: number;
    }>,
    guests: number
  ) {
    const {
      error: deleteError,
    } =
      await supabaseAdmin
        .from("restaurant_table_assignments")
        .delete()
        .eq(
          "reservation_id",
          reservationId
        );

    if (deleteError) {
      throw deleteError;
    }

    let remainingGuests = guests;

    const assignments = tables.map(
      (table, index) => {
        const assignedGuests =
          index === tables.length - 1
            ? remainingGuests
            : Math.min(
                table.capacity,
                remainingGuests
              );

        remainingGuests -= assignedGuests;

        return {
          reservation_id: reservationId,
          table_id: table.id,
          assigned_guests: assignedGuests,
          is_primary: index === 0,
          notes:
            tables.length > 1
              ? "Asignación automática por combinación de mesas"
              : "Asignación automática",
        };
      }
    );

    const {
      error: insertError,
    } =
      await supabaseAdmin
        .from("restaurant_table_assignments")
        .insert(assignments);

    if (insertError) {
      throw insertError;
    }
  }

  async canCustomerCancel(id: string): Promise<{ allowed: boolean; reason?: string }> {
    const current = await this.findById(id);
    if (!current) {
      return { allowed: false, reason: "RESERVATION_NOT_FOUND" };
    }

    const policy = await this.getReservationPolicy(current.restaurant_id);

    if (!policy.allowCancellations) {
      return { allowed: false, reason: "CANCELLATIONS_DISABLED" };
    }

    if (
      current.status !== ReservationStatus.PENDING &&
      current.status !== ReservationStatus.CONFIRMED
    ) {
      return { allowed: false, reason: "CANCELLATION_NOT_ALLOWED_FOR_STATUS" };
    }

    const startAt = new Date(current.start_at).getTime();
    const minimum = Date.now() + policy.cancellationLimitHours * 60 * 60 * 1000;

    if (startAt < minimum) {
      return { allowed: false, reason: "CANCELLATION_WINDOW_EXPIRED" };
    }

    return { allowed: true };
  }

  async cancelByCustomer(id: string) {
    const result = await this.canCustomerCancel(id);
    if (!result.allowed) {
      throw new Error(result.reason ?? "CANCELLATION_NOT_ALLOWED");
    }
    return this.cancel(id);
  }

  async confirm(id: string) {
    return this.update(id, {
      status:
        ReservationStatus.CONFIRMED,
    });
  }

  async cancel(id: string) {
    return this.update(id, {
      status:
        ReservationStatus.CANCELLED,
    });
  }

  async checkIn(id: string) {
    return this.update(id, {
      status:
        ReservationStatus.CHECKED_IN,
    });
  }

  async complete(id: string) {
    return this.update(id, {
      status:
        ReservationStatus.COMPLETED,
    });
  }

  async noShow(id: string) {
    return this.update(id, {
      status:
        ReservationStatus.NO_SHOW,
    });
  }

  async delete(id: string) {
    return this.cancel(id);
  }

  private statusToLogAction(
    status: ReservationStatus
  ) {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return "confirmed";

      case ReservationStatus.CHECKED_IN:
        return "checked_in";

      case ReservationStatus.COMPLETED:
        return "finished";

      case ReservationStatus.CANCELLED:
        return "cancelled";

      case ReservationStatus.NO_SHOW:
        return "no_show";

      default:
        return "updated";
    }
  }

  private async createLog({
    reservationId,
    restaurantId,
    action,
    previousStatus,
    newStatus,
    message,
    metadata,
  }: {
    reservationId: string;
    restaurantId: string;
    action: string;
    previousStatus?: string | null;
    newStatus?: string | null;
    message?: string;
    metadata?: Record<string, unknown>;
  }) {
    const {
      error,
    } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_logs"
        )
        .insert({
          reservation_id:
            reservationId,
          restaurant_id:
            restaurantId,
          action,
          previous_status:
            previousStatus ?? null,
          new_status:
            newStatus ?? null,
          actor_type:
            "system",
          message:
            message ?? null,
          metadata:
            (metadata ?? {}) as never,
        });

    if (error) {
      console.error(
        "CREATE RESERVATION LOG ERROR",
        error
      );
    }
  }
}

export const reservationRepository =
  new ReservationRepository();