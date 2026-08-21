import "server-only";

import { supabaseAdmin } from "@/lib/supabase/supabase";
import type { Database, Json } from "@/types/database.types";

/**
 * Repositorio central de configuración de reservas.
 *
 * Este archivo deja preparada toda la configuración que necesitaremos para:
 *
 * - duración de una reserva;
 * - intervalo entre horarios;
 * - anticipación mínima;
 * - anticipación máxima;
 * - confirmación automática/manual;
 * - límites de personas;
 * - datos de contacto obligatorios;
 * - cancelaciones;
 * - buffers antes/después de una reserva;
 * - zona horaria;
 * - calendario semanal;
 * - fechas especiales/bloqueos especiales.
 *
 * La pantalla de configuración se puede construir después encima de este
 * repositorio sin tener que volver a mover la lógica de negocio.
 */

export type ReservationSettings =
  Database["public"]["Tables"]["restaurant_reservation_settings"]["Row"];

export type ReservationSettingsInsert =
  Database["public"]["Tables"]["restaurant_reservation_settings"]["Insert"];

export type ReservationSettingsUpdate =
  Database["public"]["Tables"]["restaurant_reservation_settings"]["Update"];

export type ReservationPolicy = {
  reservationsEnabled: boolean;
  reservationDurationMinutes: number;
  slotIntervalMinutes: number;

  minAdvanceHours: number;
  maxAdvanceDays: number;

  autoConfirm: boolean;

  minGuestsPerReservation: number;
  maxGuestsPerReservation: number;

  allowSameDay: boolean;
  allowCancellations: boolean;
  cancellationLimitHours: number;

  requirePhone: boolean;
  requireEmail: boolean;

  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;

  timezone: string;

  specialDates: Json;
  weeklySchedule: Json;
};

export type ReservationSettingsInput = {
  reservations_enabled?: boolean;
  reservation_duration_minutes?: number;
  slot_interval_minutes?: number;

  min_advance_hours?: number;
  max_advance_days?: number;

  auto_confirm?: boolean;

  min_guests_per_reservation?: number;
  max_guests_per_reservation?: number;

  allow_same_day?: boolean;
  allow_cancellations?: boolean;
  cancellation_limit_hours?: number;

  require_phone?: boolean;
  require_email?: boolean;

  buffer_before_minutes?: number;
  buffer_after_minutes?: number;

  timezone?: string;

  special_dates?: Json;
  weekly_schedule?: Json;
};

export class SettingsRepository {
  /**
   * Obtiene la configuración existente.
   *
   * No crea registros automáticamente.
   */
  async find(
    restaurantId: string
  ): Promise<ReservationSettings | null> {
    this.assertRestaurantId(restaurantId);

    const { data, error } = await supabaseAdmin
      .from("restaurant_reservation_settings")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Obtiene la configuración y, si todavía no existe, crea la fila usando
   * los defaults definidos en PostgreSQL.
   *
   * Esto permite que la futura pantalla de configuración funcione incluso
   * para restaurantes que todavía no hayan guardado preferencias.
   */
  async getOrCreate(
    restaurantId: string
  ): Promise<ReservationSettings> {
    this.assertRestaurantId(restaurantId);

    const existing = await this.find(restaurantId);

    if (existing) {
      return existing;
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_reservation_settings")
      .insert({
        restaurant_id: restaurantId,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Actualiza solamente los campos enviados.
   *
   * Antes de tocar la base se validan las reglas que deben ser invariantes
   * para que disponibilidad y creación de reservas puedan confiar en ellas.
   */
  async update(
    restaurantId: string,
    input: ReservationSettingsInput
  ): Promise<ReservationSettings> {
    this.assertRestaurantId(restaurantId);

    const payload = this.buildUpdatePayload(input);

    if (Object.keys(payload).length === 0) {
      return this.getOrCreate(restaurantId);
    }

    const current = await this.getOrCreate(restaurantId);

    const merged = {
      ...current,
      ...payload,
    };

    this.validateSettings(merged);

    const { data, error } = await supabaseAdmin
      .from("restaurant_reservation_settings")
      .update(payload)
      .eq("restaurant_id", restaurantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Guarda una configuración completa mediante upsert.
   *
   * restaurant_id es UNIQUE/one-to-one en esta tabla, por lo que este método
   * es el punto recomendado para la futura pantalla de configuración.
   */
  async upsert(
    restaurantId: string,
    input: ReservationSettingsInput
  ): Promise<ReservationSettings> {
    this.assertRestaurantId(restaurantId);

    const payload = this.buildUpdatePayload(input);

    const current = await this.find(restaurantId);

    const merged = {
      ...(current ?? {}),
      restaurant_id: restaurantId,
      ...payload,
    };

    this.validateSettings(merged);

    const insertPayload: ReservationSettingsInsert = {
      restaurant_id: restaurantId,
      ...payload,
    };

    const { data, error } = await supabaseAdmin
      .from("restaurant_reservation_settings")
      .upsert(insertPayload, {
        onConflict: "restaurant_id",
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Devuelve la configuración en el formato que consumen los servicios
   * de disponibilidad.
   */
  async getPolicy(
    restaurantId: string
  ): Promise<ReservationPolicy> {
    const settings = await this.getOrCreate(restaurantId);

    this.validateSettings(settings);

    return this.toPolicy(settings);
  }

  /**
   * Restaura únicamente las reglas operativas principales a los defaults
   * actuales del motor de disponibilidad.
   *
   * Los datos administrativos restantes no se tocan.
   */
  async resetAvailabilityPolicy(
    restaurantId: string
  ): Promise<ReservationSettings> {
    return this.update(restaurantId, {
      reservations_enabled: true,
      reservation_duration_minutes: 90,
      slot_interval_minutes: 30,
      min_advance_hours: 0,
      max_advance_days: 30,
    });
  }

  /**
   * Convierte la fila de Supabase en la política que usa el dominio.
   */
  toPolicy(
    settings: ReservationSettings
  ): ReservationPolicy {
    return {
      reservationsEnabled:
        settings.reservations_enabled,

      reservationDurationMinutes:
        settings.reservation_duration_minutes,

      slotIntervalMinutes:
        settings.slot_interval_minutes,

      minAdvanceHours:
        settings.min_advance_hours,

      maxAdvanceDays:
        settings.max_advance_days,

      autoConfirm:
        settings.auto_confirm,

      minGuestsPerReservation:
        settings.min_guests_per_reservation,

      maxGuestsPerReservation:
        settings.max_guests_per_reservation,

      allowSameDay:
        settings.allow_same_day,

      allowCancellations:
        settings.allow_cancellations,

      cancellationLimitHours:
        settings.cancellation_limit_hours,

      requirePhone:
        settings.require_phone,

      requireEmail:
        settings.require_email,

      bufferBeforeMinutes:
        settings.buffer_before_minutes,

      bufferAfterMinutes:
        settings.buffer_after_minutes,

      timezone:
        settings.timezone,

      specialDates:
        settings.special_dates,

      weeklySchedule:
        settings.weekly_schedule,
    };
  }

  private buildUpdatePayload(
    input: ReservationSettingsInput
  ): ReservationSettingsUpdate {
    const payload: ReservationSettingsUpdate = {};

    if (input.reservations_enabled !== undefined) {
      payload.reservations_enabled =
        input.reservations_enabled;
    }

    if (
      input.reservation_duration_minutes !==
      undefined
    ) {
      payload.reservation_duration_minutes =
        input.reservation_duration_minutes;
    }

    if (
      input.slot_interval_minutes !==
      undefined
    ) {
      payload.slot_interval_minutes =
        input.slot_interval_minutes;
    }

    if (input.min_advance_hours !== undefined) {
      payload.min_advance_hours =
        input.min_advance_hours;
    }

    if (input.max_advance_days !== undefined) {
      payload.max_advance_days =
        input.max_advance_days;
    }

    if (input.auto_confirm !== undefined) {
      payload.auto_confirm =
        input.auto_confirm;
    }

    if (
      input.min_guests_per_reservation !==
      undefined
    ) {
      payload.min_guests_per_reservation =
        input.min_guests_per_reservation;
    }

    if (
      input.max_guests_per_reservation !==
      undefined
    ) {
      payload.max_guests_per_reservation =
        input.max_guests_per_reservation;
    }

    if (input.allow_same_day !== undefined) {
      payload.allow_same_day =
        input.allow_same_day;
    }

    if (
      input.allow_cancellations !==
      undefined
    ) {
      payload.allow_cancellations =
        input.allow_cancellations;
    }

    if (
      input.cancellation_limit_hours !==
      undefined
    ) {
      payload.cancellation_limit_hours =
        input.cancellation_limit_hours;
    }

    if (input.require_phone !== undefined) {
      payload.require_phone =
        input.require_phone;
    }

    if (input.require_email !== undefined) {
      payload.require_email =
        input.require_email;
    }

    if (
      input.buffer_before_minutes !==
      undefined
    ) {
      payload.buffer_before_minutes =
        input.buffer_before_minutes;
    }

    if (
      input.buffer_after_minutes !==
      undefined
    ) {
      payload.buffer_after_minutes =
        input.buffer_after_minutes;
    }

    if (input.timezone !== undefined) {
      payload.timezone =
        input.timezone;
    }

    if (input.special_dates !== undefined) {
      payload.special_dates =
        input.special_dates;
    }

    if (
      input.weekly_schedule !==
      undefined
    ) {
      payload.weekly_schedule =
        input.weekly_schedule;
    }

    return payload;
  }

  private validateSettings(
    settings: Partial<ReservationSettings>
  ): void {
    const duration =
      settings.reservation_duration_minutes;

    if (
      duration !== undefined &&
      (!Number.isFinite(duration) ||
        duration < 1 ||
        duration > 24 * 60)
    ) {
      throw new Error(
        "INVALID_RESERVATION_DURATION"
      );
    }

    const slotInterval =
      settings.slot_interval_minutes;

    if (
      slotInterval !== undefined &&
      (!Number.isFinite(slotInterval) ||
        slotInterval < 1 ||
        slotInterval > 24 * 60)
    ) {
      throw new Error(
        "INVALID_SLOT_INTERVAL"
      );
    }

    const minimumHours =
      settings.min_advance_hours;

    if (
      minimumHours !== undefined &&
      (!Number.isFinite(minimumHours) ||
        minimumHours < 0)
    ) {
      throw new Error(
        "INVALID_MIN_ADVANCE_HOURS"
      );
    }

    const maximumDays =
      settings.max_advance_days;

    if (
      maximumDays !== undefined &&
      (!Number.isFinite(maximumDays) ||
        maximumDays < 0)
    ) {
      throw new Error(
        "INVALID_MAX_ADVANCE_DAYS"
      );
    }

    if (
      minimumHours !== undefined &&
      maximumDays !== undefined &&
      maximumDays * 24 <
        minimumHours
    ) {
      throw new Error(
        "INVALID_ADVANCE_WINDOW"
      );
    }

    const minGuests =
      settings.min_guests_per_reservation;

    if (
      minGuests !== undefined &&
      (!Number.isInteger(minGuests) ||
        minGuests < 1)
    ) {
      throw new Error(
        "INVALID_MIN_GUESTS"
      );
    }

    const maxGuests =
      settings.max_guests_per_reservation;

    if (
      maxGuests !== undefined &&
      (!Number.isInteger(maxGuests) ||
        maxGuests < 1)
    ) {
      throw new Error(
        "INVALID_MAX_GUESTS"
      );
    }

    if (
      minGuests !== undefined &&
      maxGuests !== undefined &&
      minGuests > maxGuests
    ) {
      throw new Error(
        "INVALID_GUEST_RANGE"
      );
    }

    const cancellationLimit =
      settings.cancellation_limit_hours;

    if (
      cancellationLimit !== undefined &&
      (!Number.isFinite(
        cancellationLimit
      ) ||
        cancellationLimit < 0)
    ) {
      throw new Error(
        "INVALID_CANCELLATION_LIMIT"
      );
    }

    const bufferBefore =
      settings.buffer_before_minutes;

    if (
      bufferBefore !== undefined &&
      (!Number.isFinite(bufferBefore) ||
        bufferBefore < 0)
    ) {
      throw new Error(
        "INVALID_BUFFER_BEFORE"
      );
    }

    const bufferAfter =
      settings.buffer_after_minutes;

    if (
      bufferAfter !== undefined &&
      (!Number.isFinite(bufferAfter) ||
        bufferAfter < 0)
    ) {
      throw new Error(
        "INVALID_BUFFER_AFTER"
      );
    }

    const timezone =
      settings.timezone;

    if (
      timezone !== undefined &&
      !timezone.trim()
    ) {
      throw new Error(
        "INVALID_TIMEZONE"
      );
    }
  }

  private assertRestaurantId(
    restaurantId: string
  ): void {
    if (
      typeof restaurantId !== "string" ||
      !restaurantId.trim()
    ) {
      throw new Error(
        "RESTAURANT_ID_REQUIRED"
      );
    }
  }
}

export const settingsRepository =
  new SettingsRepository();