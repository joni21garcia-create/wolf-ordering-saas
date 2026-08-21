import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/supabase";

const DEFAULT_NO_SHOW_TOLERANCE_MINUTES = 15;
const MAX_RESERVATIONS_PER_RUN = 500;

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  // Fail closed in production. In development we allow manual execution so the
  // endpoint can be tested locally without configuring a secret.
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function getTimeZoneOffsetMs(timeZone: string, instant: Date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
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
      .formatToParts(instant)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );

  return asUtc - instant.getTime();
}

function zonedLocalDateTimeToUtc(
  reservationDate: string,
  startTime: string,
  timeZone: string,
) {
  const [year, month, day] = reservationDate.split("-").map(Number);
  const [hour, minute, second = 0] = startTime
    .slice(0, 8)
    .split(":")
    .map(Number);

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    Number.isNaN(second)
  ) {
    return null;
  }

  const localAsUtc = new Date(
    Date.UTC(year, month - 1, day, hour, minute, second),
  );

  // Resolve the offset at the reservation instant so DST-aware timezones work
  // correctly as well as America/Guayaquil.
  const offset = getTimeZoneOffsetMs(timeZone, localAsUtc);
  return new Date(localAsUtc.getTime() - offset);
}

function hasReachedNoShowThreshold(
  reservationDate: string,
  startTime: string,
  timeZone: string,
  toleranceMinutes: number,
  now = new Date(),
) {
  const reservationStartUtc = zonedLocalDateTimeToUtc(
    reservationDate,
    startTime,
    timeZone,
  );

  if (!reservationStartUtc) return false;

  const thresholdUtc =
    reservationStartUtc.getTime() + toleranceMinutes * 60_000;

  return now.getTime() >= thresholdUtc;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  try {
    const { data: reservations, error } = await supabaseAdmin
      .from("restaurant_reservations")
      .select(
        "id, restaurant_id, reservation_date, start_time, timezone, status",
      )
      .eq("status", "confirmed")
      .gte(
        "reservation_date",
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
      )
      .order("reservation_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(MAX_RESERVATIONS_PER_RUN);

    if (error) {
      throw error;
    }

    const candidateReservations = reservations ?? [];
    const noShowIds: string[] = [];
    const errors: Array<{ id: string; message: string }> = [];

    for (const reservation of candidateReservations) {
      const timeZone =
        reservation.timezone?.trim() || "America/Guayaquil";

      if (
        !hasReachedNoShowThreshold(
          reservation.reservation_date,
          reservation.start_time,
          timeZone,
          DEFAULT_NO_SHOW_TOLERANCE_MINUTES,
        )
      ) {
        continue;
      }

      try {
        // The status condition makes this transition atomic: if the manager
        // checks the guest in between the candidate query and this update, the
        // row no longer matches and we leave it as CHECKED_IN.
        const { data: updatedReservation, error: updateError } =
          await supabaseAdmin
            .from("restaurant_reservations")
            .update({
              status: "no_show",
              updated_at: new Date().toISOString(),
            })
            .eq("id", reservation.id)
            .eq("status", "confirmed")
            .select("id, restaurant_id, status")
            .maybeSingle();

        if (updateError) {
          throw updateError;
        }

        if (!updatedReservation) {
          continue;
        }

        const { error: logError } = await supabaseAdmin
          .from("restaurant_reservation_logs")
          .insert({
            reservation_id: reservation.id,
            restaurant_id: reservation.restaurant_id,
            action: "no_show",
            previous_status: "confirmed",
            new_status: "no_show",
            actor_type: "system",
            message: "No Show automático por inasistencia.",
            metadata: {
              automatic: true,
              toleranceMinutes: DEFAULT_NO_SHOW_TOLERANCE_MINUTES,
            },
          });

        if (logError) {
          // The status change already succeeded. Keep the reservation in
          // NO_SHOW and report the logging failure for observability.
          console.error("AUTO NO-SHOW LOG ERROR", logError);
        }

        noShowIds.push(reservation.id);
      } catch (error) {
        errors.push({
          id: reservation.id,
          message:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      checked: candidateReservations.length,
      converted: noShowIds.length,
      noShowIds,
      errors,
      toleranceMinutes: DEFAULT_NO_SHOW_TOLERANCE_MINUTES,
    });
  } catch (error) {
    console.error("AUTO NO-SHOW CRON ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}