import { supabaseAdmin } from "@/lib/supabase/supabase";
import { tableCombinationService } from "../services/TableCombinationService";

export type AvailabilityTable = {
  id: string;
  restaurant_id: string;
  code: string;
  name: string;
  area?: string | null;
  capacity: number;
  min_capacity?: number | null;
  max_capacity?: number | null;
  position_x?: number | null;
  position_y?: number | null;
  shape?: string | null;
  color?: string | null;
  active: boolean;
  joinable?: boolean;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type SpecialDateSettings = {
  date: string;
  closed?: boolean;
  open?: string | null;
  close?: string | null;
  label?: string | null;
};

type ReservationSettings = {
  reservations_enabled: boolean;
  reservation_duration_minutes: number;
  slot_interval_minutes: number;
  min_advance_hours: number;
  max_advance_days: number;
  min_guests_per_reservation: number;
  max_guests_per_reservation: number;
  buffer_before_minutes: number;
  buffer_after_minutes: number;
  special_dates?: SpecialDateSettings[] | null;
  weekly_schedule?: unknown;
};

type RestaurantSchedule = {
  restaurant_id: string;
  sunday_open: string | null;
  sunday_close: string | null;
  monday_open: string | null;
  monday_close: string | null;
  tuesday_open: string | null;
  tuesday_close: string | null;
  wednesday_open: string | null;
  wednesday_close: string | null;
  thursday_open: string | null;
  thursday_close: string | null;
  friday_open: string | null;
  friday_close: string | null;
  saturday_open: string | null;
  saturday_close: string | null;
};

type ReservationBlock = {
  id: string;
  table_id: string | null;
  block_type: string;
  start_at: string;
  end_at: string;
  affects_all_tables: boolean;
};

type AvailabilityPolicy = {
  reservationsEnabled: boolean;
  reservationDurationMinutes: number;
  slotIntervalMinutes: number;
  minAdvanceHours: number;
  maxAdvanceDays: number;
  minGuestsPerReservation: number;
  maxGuestsPerReservation: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
};

type AvailabilityFailureReason =
  | "RESTAURANT_ID_REQUIRED"
  | "DATE_RANGE_REQUIRED"
  | "INVALID_GUEST_COUNT"
  | "INVALID_TIME_RANGE"
  | "RESERVATIONS_DISABLED"
  | "SCHEDULE_NOT_CONFIGURED"
  | "OUTSIDE_RESTAURANT_HOURS"
  | "MIN_ADVANCE_NOT_MET"
  | "MAX_ADVANCE_EXCEEDED"
  | "NO_TABLE_AVAILABLE";

export type AvailabilityResult = {
  available: boolean;
  table: AvailabilityTable | null;
  tables: AvailabilityTable[];
  reason?: AvailabilityFailureReason | string;
};

export class AvailabilityRepository {
  private readonly restaurantTimeZone = "America/Guayaquil";
  private readonly restaurantUtcOffsetHours = 5;

  async getTables(
    restaurantId: string
  ): Promise<AvailabilityTable[]> {
    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .eq("active", true)
      .order("capacity", {
        ascending: true,
      });

    if (error) {
      throw error;
    }

    return (data ?? []) as AvailabilityTable[];
  }

  async getSettings(
    restaurantId: string
  ): Promise<ReservationSettings | null> {
    const { data, error } = await supabaseAdmin
      .from("restaurant_reservation_settings")
      .select(
        "reservations_enabled, reservation_duration_minutes, slot_interval_minutes, min_advance_hours, max_advance_days, min_guests_per_reservation, max_guests_per_reservation, buffer_before_minutes, buffer_after_minutes, special_dates, weekly_schedule"
      )
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as ReservationSettings | null;
  }

  async getRestaurantSchedule(
    restaurantId: string
  ): Promise<RestaurantSchedule | null> {
    const { data, error } = await supabaseAdmin
      .from("schedule_settings")
      .select(
        "restaurant_id, sunday_open, sunday_close, monday_open, monday_close, tuesday_open, tuesday_close, wednesday_open, wednesday_close, thursday_open, thursday_close, friday_open, friday_close, saturday_open, saturday_close"
      )
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data as RestaurantSchedule | null;
  }

  private normalizeSpecialDates(value: unknown): SpecialDateSettings[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value
      .filter(
        (item): item is Record<string, unknown> =>
          Boolean(
            item &&
              typeof item === "object" &&
              !Array.isArray(item),
          ),
      )
      .map((item) => ({
        date: typeof item.date === "string" ? item.date.slice(0, 10) : "",
        closed: item.closed === true,
        open:
          typeof item.open === "string"
            ? item.open.slice(0, 5)
            : null,
        close:
          typeof item.close === "string"
            ? item.close.slice(0, 5)
            : null,
        label:
          typeof item.label === "string"
            ? item.label
            : null,
      }))
      .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item.date));
  }

  private getSpecialDate(
    date: string,
    settings: ReservationSettings | null,
  ): SpecialDateSettings | null {
    const specialDates = this.normalizeSpecialDates(
      settings?.special_dates,
    );

    return (
      specialDates.find((item) => item.date === date) ??
      null
    );
  }

  private getWorkingHoursForDate(
    date: string,
    schedule: RestaurantSchedule | null,
    settings: ReservationSettings | null,
  ): Array<{ open: string; close: string }> {
    const specialDate = this.getSpecialDate(date, settings);

    if (specialDate?.closed) {
      return [];
    }

    if (specialDate?.open && specialDate?.close) {
      return [
        {
          open: specialDate.open,
          close: specialDate.close,
        },
      ];
    }

    const weeklyHours = this.getWeeklyScheduleHours(date, settings?.weekly_schedule);

    if (weeklyHours.length > 0) {
      return weeklyHours;
    }

    const legacyHour = this.getWorkingHour(date, schedule);
    return legacyHour ? [legacyHour] : [];
  }

  private getWorkingHourForDate(
    date: string,
    schedule: RestaurantSchedule | null,
    settings: ReservationSettings | null,
  ): {
    open: string;
    close: string;
  } | null {
    return this.getWorkingHoursForDate(date, schedule, settings)[0] ?? null;
  }

  private getWeeklyScheduleHours(
    date: string,
    weeklySchedule: unknown,
  ): Array<{ open: string; close: string }> {
    if (!weeklySchedule || typeof weeklySchedule !== "object") {
      return [];
    }

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ] as const;

    const day = dayNames[this.getWeekdayNumber(date)];
    const root = weeklySchedule as Record<string, unknown>;
    const rawDay = root[day];

    return this.normalizeWeeklyDay(rawDay);
  }

  private normalizeWeeklyDay(
    value: unknown,
  ): Array<{ open: string; close: string }> {
    const result: Array<{ open: string; close: string }> = [];

    const addSlot = (value: unknown) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return;
      }

      const item = value as Record<string, unknown>;
      const open = this.normalizeScheduleTime(
        typeof item.open === "string"
          ? item.open
          : typeof item.start === "string"
            ? item.start
            : null,
      );
      const close = this.normalizeScheduleTime(
        typeof item.close === "string"
          ? item.close
          : typeof item.end === "string"
            ? item.end
            : null,
      );

      if (open && close) {
        result.push({ open, close });
      }
    };

    if (Array.isArray(value)) {
      value.forEach(addSlot);
      return result;
    }

    if (!value || typeof value !== "object") {
      return result;
    }

    const objectValue = value as Record<string, unknown>;

    if (objectValue.enabled === false) {
      return result;
    }

    if (Array.isArray(objectValue.periods)) {
      objectValue.periods.forEach(addSlot);
    }

    if (Array.isArray(objectValue.slots)) {
      objectValue.slots.forEach(addSlot);
    }

    if (Array.isArray(objectValue.ranges)) {
      objectValue.ranges.forEach(addSlot);
    }

    if (result.length === 0) {
      addSlot(value);
    }

    return result;
  }

  private normalizeScheduleTime(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const normalized = value.trim().slice(0, 5);

    if (!/^\d{2}:\d{2}$/.test(normalized)) {
      return null;
    }

    const [hour, minute] = normalized.split(":").map(Number);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }

    return normalized;
  }

  private getCurrentRestaurantDate(): string {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: this.restaurantTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  }

  private getWeekdayNumber(date: string): number {
    const [year, month, day] =
      date.split("-").map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day
      )
    ).getUTCDay();
  }

  private getWorkingHour(
    date: string,
    schedule: RestaurantSchedule | null
  ): {
    open: string;
    close: string;
  } | null {
    if (!schedule) {
      return null;
    }

    const keys: Array<
      [
        keyof RestaurantSchedule,
        keyof RestaurantSchedule
      ]
    > = [
      ["sunday_open", "sunday_close"],
      ["monday_open", "monday_close"],
      ["tuesday_open", "tuesday_close"],
      ["wednesday_open", "wednesday_close"],
      ["thursday_open", "thursday_close"],
      ["friday_open", "friday_close"],
      ["saturday_open", "saturday_close"],
    ];

    const [
      openKey,
      closeKey,
    ] =
      keys[
        this.getWeekdayNumber(date)
      ];

    const open =
      schedule[openKey];

    const close =
      schedule[closeKey];

    if (!open || !close) {
      return null;
    }

    return {
      open,
      close,
    };
  }

  private getMaximumDays(
    settings: ReservationSettings | null
  ): number {
    return Math.max(
      0,
      settings?.max_advance_days ?? 30
    );
  }

  private getMinimumHours(
    settings: ReservationSettings | null
  ): number {
    return Math.max(
      0,
      settings?.min_advance_hours ?? 0
    );
  }

  private timeToMinutes(
    time: string
  ): number {
    const [
      hour,
      minute,
    ] =
      time
        .split(":")
        .map(Number);

    return (
      hour * 60 +
      minute
    );
  }

  private minutesToTime(
    value: number
  ): string {
    const normalized =
      ((value % 1440) + 1440) %
      1440;

    const hour =
      Math.floor(
        normalized / 60
      );

    const minute =
      normalized % 60;

    return `${String(hour).padStart(
      2,
      "0"
    )}:${String(minute).padStart(
      2,
      "0"
    )}`;
  }

  private getAvailabilityPolicy(
    settings: ReservationSettings | null
  ): AvailabilityPolicy {
    return {
      reservationsEnabled:
        settings?.reservations_enabled ??
        true,

      reservationDurationMinutes:
        Math.max(
          1,
          settings
            ?.reservation_duration_minutes ??
            90
        ),

      slotIntervalMinutes:
        Math.max(
          1,
          settings
            ?.slot_interval_minutes ??
            30
        ),

      minAdvanceHours:
        this.getMinimumHours(
          settings
        ),

      maxAdvanceDays:
        this.getMaximumDays(
          settings
        ),
      minGuestsPerReservation: Math.max(1, settings?.min_guests_per_reservation ?? 1),
      maxGuestsPerReservation: Math.max(1, settings?.max_guests_per_reservation ?? 20),
      bufferBeforeMinutes: Math.max(0, settings?.buffer_before_minutes ?? 0),
      bufferAfterMinutes: Math.max(0, settings?.buffer_after_minutes ?? 0),
    };
  }

  private getBlockingReservationStatuses(): string[] {
    return [
      "pending",
      "confirmed",
      "checked_in",
    ];
  }

  private isBlockingReservationStatus(
    status: string
  ): boolean {
    return this
      .getBlockingReservationStatuses()
      .includes(status);
  }

  private localDateTimeToUtc(
    date: string,
    time: string
  ): string {
    const [
      year,
      month,
      day,
    ] =
      date
        .split("-")
        .map(Number);

    const [
      hour,
      minute,
    ] =
      time
        .slice(0, 5)
        .split(":")
        .map(Number);

    const utcMillis =
      Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
      ) +
      this.restaurantUtcOffsetHours *
        60 *
        60 *
        1000;

    return new Date(
      utcMillis
    ).toISOString();
  }

  private parseReservationDateTime(
    value: string
  ): Date | null {
    if (!value) {
      return null;
    }

    const hasExplicitTimezone =
      /(?:Z|[+-]\d{2}:?\d{2})$/i.test(
        value
      );

    const parsed =
      hasExplicitTimezone
        ? new Date(value)
        : new Date(
            this.localDateTimeToUtc(
              value.slice(0, 10),
              value.slice(11, 16)
            )
          );

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return null;
    }

    return parsed;
  }

  private getRestaurantLocalParts(
    value: string
  ): {
    date: string;
    time: string;
  } | null {
    const parsed =
      this.parseReservationDateTime(
        value
      );

    if (!parsed) {
      return null;
    }

    const parts =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            this.restaurantTimeZone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }
      ).formatToParts(
        parsed
      );

    const values =
      Object.fromEntries(
        parts
          .filter(
            (part) =>
              part.type !==
              "literal"
          )
          .map(
            (part) => [
              part.type,
              part.value,
            ]
          )
      );

    return {
      date: `${values.year}-${values.month}-${values.day}`,
      time: `${values.hour}:${values.minute}`,
    };
  }

  private isWithinAdvanceWindow(
    start: string,
    policy: AvailabilityPolicy
  ): boolean {
    const startAt =
      this.parseReservationDateTime(
        start
      );

    if (!startAt) {
      return false;
    }

    const now =
      Date.now();

    return (
      startAt.getTime() >=
        now +
          policy.minAdvanceHours *
            60 *
            60 *
            1000 &&
      startAt.getTime() <=
        now +
          policy.maxAdvanceDays *
            24 *
            60 *
            60 *
            1000
    );
  }

  private isWithinSchedule(
    start: string,
    end: string,
    schedule: RestaurantSchedule | null,
    workingHourOverride?: {
      open: string;
      close: string;
    } | null,
  ): boolean {
    const localStart =
      this.getRestaurantLocalParts(
        start
      );

    const localEnd =
      this.getRestaurantLocalParts(
        end
      );

    if (
      !localStart ||
      !localEnd
    ) {
      return false;
    }

    const workingHour =
      workingHourOverride ??
      this.getWorkingHour(
        localStart.date,
        schedule
      );

    if (!workingHour) {
      return false;
    }

    const startMinutes =
      this.timeToMinutes(
        localStart.time
      );

    const endMinutes =
      this.timeToMinutes(
        localEnd.time
      );

    const openMinutes =
      this.timeToMinutes(
        workingHour.open
      );

    const closeMinutes =
      this.timeToMinutes(
        workingHour.close
      );

    const crossesMidnight =
      closeMinutes <=
      openMinutes;

    if (!crossesMidnight) {
      return (
        localStart.date ===
          localEnd.date &&
        startMinutes >=
          openMinutes &&
        endMinutes <=
          closeMinutes
      );
    }

    if (
      startMinutes >=
      openMinutes
    ) {
      return (
        startMinutes >=
          openMinutes &&
        (
          localStart.date !==
            localEnd.date ||
          endMinutes <=
            closeMinutes
        )
      );
    }

    return (
      localStart.date !==
        localEnd.date &&
      endMinutes <=
        closeMinutes
    );
  }

  private buildReservationInterval(
    date: string,
    time: string,
    durationMinutes: number
  ): {
    start: string;
    end: string;
  } {
    const start =
      new Date(
        this.localDateTimeToUtc(
          date,
          time
        )
      );

    const end =
      new Date(
        start.getTime() +
          durationMinutes *
            60 *
            1000
      );

    return {
      start:
        start.toISOString(),
      end:
        end.toISOString(),
    };
  }

  /**
   * Valida en backend que el intervalo completo de una reserva pertenezca
   * a una franja configurada para la fecha solicitada.
   *
   * Esta validación es independiente de la UI: aunque un cliente envíe
   * manualmente una hora que no aparece entre los slots, la reserva no
   * puede persistirse fuera del horario configurado.
   */
  async validateReservationInterval(
    restaurantId: string,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    if (!restaurantId || !date || !startTime || !endTime) {
      return false;
    }

    const [settings, schedule] = await Promise.all([
      this.getSettings(restaurantId),
      this.getRestaurantSchedule(restaurantId),
    ]);

    if (settings && !settings.reservations_enabled) {
      return false;
    }

    const start = this.localDateTimeToUtc(date, startTime);
    const end = this.localDateTimeToUtc(date, endTime);

    const startDate = this.parseReservationDateTime(start);
    const endDate = this.parseReservationDateTime(end);

    if (!startDate || !endDate || startDate.getTime() >= endDate.getTime()) {
      return false;
    }

    const workingHours = this.getWorkingHoursForDate(
      date,
      schedule,
      settings,
    );

    if (workingHours.length === 0) {
      return false;
    }

    return workingHours.some((workingHour) =>
      this.isWithinSchedule(
        start,
        end,
        schedule,
        workingHour,
      ),
    );
  }

  async getAvailableDates(
    restaurantId: string
  ): Promise<string[]> {
    const [
      settings,
      schedule,
    ] =
      await Promise.all([
        this.getSettings(
          restaurantId
        ),
        this.getRestaurantSchedule(
          restaurantId
        ),
      ]);

    if (
      settings &&
      !settings.reservations_enabled
    ) {
      return [];
    }

    const maximumDays =
      this.getMaximumDays(
        settings
      );

    const minimumHours =
      this.getMinimumHours(
        settings
      );

    const dates: string[] =
      [];

    const [
      year,
      month,
      day,
    ] =
      this
        .getCurrentRestaurantDate()
        .split("-")
        .map(Number);

    const now =
      new Date();

    const minimumAllowed =
      new Date(
        now.getTime() +
          minimumHours *
            60 *
            60 *
            1000
      );

    const maximumAllowed =
      new Date(
        now.getTime() +
          maximumDays *
            24 *
            60 *
            60 *
            1000
      );

    for (
      let index = 0;
      index <= maximumDays;
      index++
    ) {
      const isoDate =
        new Date(
          Date.UTC(
            year,
            month - 1,
            day + index
          )
        )
          .toISOString()
          .slice(0, 10);

      const workingHours =
        this.getWorkingHoursForDate(
          isoDate,
          schedule,
          settings
        );

      if (workingHours.length === 0) {
        continue;
      }

      const dayStart =
        new Date(
          this.localDateTimeToUtc(
            isoDate,
            "00:00"
          )
        );

      const dayEnd =
        new Date(
          this.localDateTimeToUtc(
            isoDate,
            "23:59"
          )
        );

      if (
        dayEnd.getTime() <
          minimumAllowed.getTime() ||
        dayStart.getTime() >
          maximumAllowed.getTime()
      ) {
        continue;
      }

      dates.push(
        isoDate
      );
    }

    return dates;
  }

  async getAvailableTimes(
    restaurantId: string,
    date: string,
    guests: number = 1
  ): Promise<string[]> {
    if (!restaurantId || !date) {
      return [];
    }

    if (!Number.isFinite(guests) || guests <= 0) {
      return [];
    }

    const requestedGuests = Math.floor(guests);

    /*
     * Evitamos el N+1 que existía aquí:
     * cada slot llamaba a checkAvailability(), que volvía a consultar
     * tablas, settings, schedule, bloqueos y asignaciones.
     *
     * Ahora cargamos la información una sola vez y resolvemos todos
     * los slots en memoria.
     */
    const [settings, schedule, tables] = await Promise.all([
      this.getSettings(restaurantId),
      this.getRestaurantSchedule(restaurantId),
      this.getTables(restaurantId),
    ]);

    if (settings && !settings.reservations_enabled) {
      return [];
    }

    const policy = this.getAvailabilityPolicy(settings);

    if (
      requestedGuests < policy.minGuestsPerReservation ||
      requestedGuests > policy.maxGuestsPerReservation
    ) {
      return [];
    }

    const workingHours = this.getWorkingHoursForDate(
      date,
      schedule,
      settings
    );

    if (workingHours.length === 0) {
      return [];
    }

    const localDate = new Date(`${date}T00:00:00Z`);

    if (Number.isNaN(localDate.getTime())) {
      return [];
    }

    const nextLocalDate = new Date(localDate.getTime());
    nextLocalDate.setUTCDate(nextLocalDate.getUTCDate() + 1);

    const rawDayStart = this.localDateTimeToUtc(date, "00:00");
    const rawDayEnd = this.localDateTimeToUtc(
      nextLocalDate.toISOString().slice(0, 10),
      "00:00"
    );

    const assignmentDayStart = new Date(
      new Date(rawDayStart).getTime() -
        policy.bufferBeforeMinutes * 60000
    ).toISOString();
    const assignmentDayEnd = new Date(
      new Date(rawDayEnd).getTime() +
        policy.bufferAfterMinutes * 60000
    ).toISOString();

    const [blocks, assignmentData] = await Promise.all([
      this.getActiveBlocks(restaurantId, rawDayStart, rawDayEnd),
      supabaseAdmin
        .from("restaurant_table_assignments")
        .select(`
          table_id,
          restaurant_reservations!inner(
            restaurant_id,
            start_at,
            end_at,
            status
          )
        `)
        .eq("restaurant_reservations.restaurant_id", restaurantId)
        .lt("restaurant_reservations.start_at", assignmentDayEnd)
        .gt("restaurant_reservations.end_at", assignmentDayStart),
    ]);

    if (assignmentData.error) {
      throw assignmentData.error;
    }

    const restaurantBlocked = blocks.some(
      (block) => block.affects_all_tables
    );

    if (restaurantBlocked) {
      return [];
    }

    const reservationsByTable = new Map<
      string,
      Array<{ start_at: string; end_at: string; status: string }>
    >();

    for (const assignment of assignmentData.data ?? []) {
      if (!assignment.table_id) {
        continue;
      }

      const reservation =
        assignment.restaurant_reservations as {
          restaurant_id: string;
          start_at: string;
          end_at: string;
          status: string;
        } | null;

      if (
        !reservation ||
        !this.isBlockingReservationStatus(reservation.status)
      ) {
        continue;
      }

      const existing = reservationsByTable.get(assignment.table_id) ?? [];
      existing.push({
        start_at: reservation.start_at,
        end_at: reservation.end_at,
        status: reservation.status,
      });
      reservationsByTable.set(assignment.table_id, existing);
    }

    const times = new Set<string>();

    for (const workingHour of workingHours) {
      const openMinutes = this.timeToMinutes(workingHour.open);
      const closeMinutes = this.timeToMinutes(workingHour.close);
      const duration = policy.reservationDurationMinutes;
      const interval = policy.slotIntervalMinutes;
      const effectiveClose =
        closeMinutes <= openMinutes
          ? closeMinutes + 1440
          : closeMinutes;

      for (
        let current = openMinutes;
        current + duration <= effectiveClose;
        current += interval
      ) {
        const time = this.minutesToTime(current);
        const { start, end } = this.buildReservationInterval(
          date,
          time,
          duration
        );

        if (!this.isWithinAdvanceWindow(start, policy)) {
          continue;
        }

        const availableTables = tables
          .filter((table) => !this.isTableBlocked(table.id, blocks))
          .filter(
            (table) =>
              table.min_capacity == null ||
              requestedGuests >= table.min_capacity
          )
          .filter(
            (table) =>
              table.max_capacity == null ||
              requestedGuests <= table.max_capacity
          )
          .filter((table) => {
            const reservations = reservationsByTable.get(table.id) ?? [];

            return !reservations.some((reservation) => {
              const reservationStart = this.parseReservationDateTime(
                reservation.start_at
              );
              const reservationEnd = this.parseReservationDateTime(
                reservation.end_at
              );

              if (!reservationStart || !reservationEnd) {
                return false;
              }

              const occupiedStart =
                reservationStart.getTime() - policy.bufferBeforeMinutes * 60000;
              const occupiedEnd =
                reservationEnd.getTime() + policy.bufferAfterMinutes * 60000;

              return (
                occupiedStart < new Date(end).getTime() &&
                occupiedEnd > new Date(start).getTime()
              );
            });
          })
          .sort((a, b) => a.capacity - b.capacity);

        const individualTable =
          availableTables.find(
            (table) => table.capacity >= requestedGuests
          ) ?? null;

        if (individualTable) {
          times.add(time);
          continue;
        }

        const combinableTables = availableTables.filter(
          (table) => table.joinable === true
        );

        const combination =
          tableCombinationService.findBestCombination(
            combinableTables,
            requestedGuests
          );

        if (combination) {
          times.add(time);
        }
      }
    }

    return Array.from(times).sort();

  }

  async getActiveBlocks(
    restaurantId: string,
    start: string,
    end: string
  ): Promise<ReservationBlock[]> {
    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .select(
          "id, table_id, block_type, start_at, end_at, affects_all_tables"
        )
        .eq(
          "restaurant_id",
          restaurantId
        )
        .eq(
          "active",
          true
        )
        .lt(
          "start_at",
          end
        )
        .gt(
          "end_at",
          start
        );

    if (error) {
      throw error;
    }

    return (
      data ?? []
    ) as ReservationBlock[];
  }

  async getOccupiedTableIds(
    restaurantId: string,
    start: string,
    end: string,
    bufferBeforeMinutes = 0,
    bufferAfterMinutes = 0
  ): Promise<Set<string>> {
    const queryStart = new Date(
      new Date(start).getTime() - bufferBeforeMinutes * 60000
    ).toISOString();
    const queryEnd = new Date(
      new Date(end).getTime() + bufferAfterMinutes * 60000
    ).toISOString();

    const {
      data,
      error,
    } =
      await supabaseAdmin
        .from(
          "restaurant_table_assignments"
        )
        .select(`
          table_id,
          restaurant_reservations!inner(
            restaurant_id,
            start_at,
            end_at,
            status
          )
        `)
        .eq(
          "restaurant_reservations.restaurant_id",
          restaurantId
        )
        .lt(
          "restaurant_reservations.start_at",
          queryEnd
        )
        .gt(
          "restaurant_reservations.end_at",
          queryStart
        );

    if (error) {
      throw error;
    }

    const occupied =
      new Set<string>();

    for (
      const assignment of
        data ?? []
    ) {
      if (
        !assignment.table_id
      ) {
        continue;
      }

      const reservation =
        assignment
          .restaurant_reservations as {
          restaurant_id: string;
          start_at: string;
          end_at: string;
          status: string;
        } | null;

      if (
        reservation &&
        this.isBlockingReservationStatus(
          reservation.status
        )
      ) {
        occupied.add(
          assignment.table_id
        );
      }
    }

    return occupied;
  }

  private isTableBlocked(
    tableId: string,
    blocks: ReservationBlock[]
  ): boolean {
    return blocks.some(
      (block) =>
        block.affects_all_tables ||
        block.table_id ===
          tableId
    );
  }

  async checkAvailability(
    restaurantId: string,
    start: string,
    end: string,
    guests: number
  ): Promise<AvailabilityResult> {
    if (!restaurantId) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "RESTAURANT_ID_REQUIRED",
      };
    }

    if (
      !start ||
      !end
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "DATE_RANGE_REQUIRED",
      };
    }

    if (guests <= 0) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "INVALID_GUEST_COUNT",
      };
    }

    const startDate =
      this.parseReservationDateTime(
        start
      );

    const endDate =
      this.parseReservationDateTime(
        end
      );

    if (
      !startDate ||
      !endDate
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "INVALID_TIME_RANGE",
      };
    }

    if (
      startDate.getTime() >=
      endDate.getTime()
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "INVALID_TIME_RANGE",
      };
    }

    /*
     * A partir de aquí todas las consultas de disponibilidad
     * trabajan con UTC normalizado.
     */
    const normalizedStart =
      startDate.toISOString();

    const normalizedEnd =
      endDate.toISOString();

    const [
      tables,
      settings,
      schedule,
      blocks,
    ] =
      await Promise.all([
        this.getTables(
          restaurantId
        ),

        this.getSettings(
          restaurantId
        ),

        this.getRestaurantSchedule(
          restaurantId
        ),

        this.getActiveBlocks(
          restaurantId,
          normalizedStart,
          normalizedEnd
        ),
      ]);

    if (
      settings &&
      !settings.reservations_enabled
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "RESERVATIONS_DISABLED",
      };
    }

    const policy =
      this.getAvailabilityPolicy(settings);

    if (
      !Number.isInteger(guests) ||
      guests < policy.minGuestsPerReservation ||
      guests > policy.maxGuestsPerReservation
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason: "INVALID_GUEST_COUNT",
      };
    }

    const occupied = await this.getOccupiedTableIds(
      restaurantId,
      new Date(new Date(normalizedStart).getTime() - policy.bufferBeforeMinutes * 60000).toISOString(),
      new Date(new Date(normalizedEnd).getTime() + policy.bufferAfterMinutes * 60000).toISOString()
    );

    const localStartForSchedule =
      this.getRestaurantLocalParts(normalizedStart);

    const workingHoursForStart = localStartForSchedule
      ? this.getWorkingHoursForDate(
          localStartForSchedule.date,
          schedule,
          settings
        )
      : [];

    if (workingHoursForStart.length === 0) {
      return {
        available: false,
        table: null,
        tables: [],
        reason: "SCHEDULE_NOT_CONFIGURED",
      };
    }

    if (
      !this.isWithinAdvanceWindow(
        start,
        policy
      )
    ) {
      const minimum =
        Date.now() +
        policy.minAdvanceHours *
          60 *
          60 *
          1000;

      return {
        available: false,
        table: null,
        tables: [],
        reason:
          startDate.getTime() <
          minimum
            ? "MIN_ADVANCE_NOT_MET"
            : "MAX_ADVANCE_EXCEEDED",
      };
    }

    /*
     * MUY IMPORTANTE:
     *
     * isWithinSchedule convierte primero los timestamps UTC
     * a America/Guayaquil.
     *
     * Por eso una reserva local de 18:00 se evalúa como 18:00,
     * no como 23:00.
     */
    const localStart =
      this.getRestaurantLocalParts(normalizedStart);

    const scheduleIsValid = workingHoursForStart.some((workingHour) =>
      this.isWithinSchedule(
        normalizedStart,
        normalizedEnd,
        schedule,
        workingHour
      )
    );

    if (!scheduleIsValid) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "OUTSIDE_RESTAURANT_HOURS",
      };
    }

    const restaurantBlocked =
      blocks.some(
        (block) =>
          block.affects_all_tables
      );

    if (
      restaurantBlocked
    ) {
      return {
        available: false,
        table: null,
        tables: [],
        reason:
          "NO_TABLE_AVAILABLE",
      };
    }

    const availableTables =
      tables
        .filter(
          (table) =>
            !occupied.has(
              table.id
            )
        )
        .filter(
          (table) =>
            !this.isTableBlocked(
              table.id,
              blocks
            )
        )
        .filter(
          (table) =>
            table.min_capacity ==
              null ||
            guests >=
              table.min_capacity
        )
        .filter(
          (table) =>
            table.max_capacity ==
              null ||
            guests <=
              table.max_capacity
        )
        .sort(
          (a, b) =>
            a.capacity -
            b.capacity
        );

    const individualTable =
      availableTables.find(
        (table) =>
          table.capacity >=
          guests
      ) ?? null;

    if (
      individualTable
    ) {
      return {
        available: true,
        table:
          individualTable,
        tables: [
          individualTable,
        ],
      };
    }

    const combinableTables =
      availableTables.filter(
        (table) =>
          table.joinable ===
          true
      );

    const combination =
      tableCombinationService.findBestCombination(
        combinableTables,
        guests
      );

    if (
      combination
    ) {
      return {
        available: true,
        table: null,
        tables:
          combination.tables,
      };
    }

    return {
      available: false,
      table: null,
      tables: [],
      reason:
        "NO_TABLE_AVAILABLE",
    };
  }
}

export const availabilityRepository =
  new AvailabilityRepository();