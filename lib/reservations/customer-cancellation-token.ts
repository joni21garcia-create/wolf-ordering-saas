import crypto from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase/supabase";

const SECRET =
  process.env.RESERVATION_CUSTOMER_CANCEL_SECRET;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

function getSecret() {
  if (!SECRET) {
    throw new Error(
      "Falta RESERVATION_CUSTOMER_CANCEL_SECRET.",
    );
  }

  return SECRET;
}

function createSignature(
  reservationId: string,
) {
  return crypto
    .createHmac(
      "sha256",
      getSecret(),
    )
    .update(reservationId)
    .digest("hex");
}

export function getCustomerCancellationUrl(
  reservationId: string,
) {
  const signature =
    createSignature(reservationId);

  return `${SITE_URL}/reserve/manage/${encodeURIComponent(
    signature,
  )}?reservation=${encodeURIComponent(reservationId)}`;
}

export function verifyCustomerCancellationToken(
  reservationId: string,
  token: string,
) {
  if (!reservationId || !token) {
    return false;
  }

  try {
    const expected =
      createSignature(reservationId);

    const expectedBuffer =
      Buffer.from(expected, "utf8");

    const tokenBuffer =
      Buffer.from(token, "utf8");

    if (
      expectedBuffer.length !==
      tokenBuffer.length
    ) {
      return false;
    }

    return crypto.timingSafeEqual(
      expectedBuffer,
      tokenBuffer,
    );
  } catch {
    return false;
  }
}

function zonedDateTimeToUtc(
  date: string,
  time: string,
  timeZone: string,
): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute, second = 0] = time
    .slice(0, 8)
    .split(":")
    .map(Number);

  if (
    ![year, month, day, hour, minute, second].every(Number.isFinite)
  ) {
    return new Date(NaN);
  }

  const utcGuess = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
  );

  const getOffset = (instant: number) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(instant));

    const values = Object.fromEntries(
      parts
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    ) as Record<string, number>;

    return (
      Date.UTC(
        values.year,
        values.month - 1,
        values.day,
        values.hour,
        values.minute,
        values.second,
      ) - instant
    );
  };

  let utc = utcGuess - getOffset(utcGuess);
  utc = utcGuess - getOffset(utc);

  return new Date(utc);
}

export async function canCustomerCancelWithToken(
  reservationId: string,
  token: string,
) {
  if (
    !verifyCustomerCancellationToken(
      reservationId,
      token,
    )
  ) {
    return {
      allowed: false,
      reason: "invalid_token" as const,
    };
  }

  const {
    data: reservation,
    error,
  } = await supabaseAdmin
    .from("restaurant_reservations")
    .select(
      `
        id,
        restaurant_id,
        status,
        reservation_date,
        start_time,
        timezone
      `,
    )
    .eq("id", reservationId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!reservation) {
    return {
      allowed: false,
      reason: "not_found" as const,
    };
  }

  const {
    data: settings,
    error: settingsError,
  } = await supabaseAdmin
    .from("restaurant_reservation_settings")
    .select(
      "allow_cancellations, cancellation_limit_hours, timezone",
    )
    .eq(
      "restaurant_id",
      reservation.restaurant_id,
    )
    .maybeSingle();

  if (settingsError) {
    throw settingsError;
  }

  if (
    settings?.allow_cancellations !== true
  ) {
    return {
      allowed: false,
      reason: "disabled" as const,
    };
  }

  const limitHours = Number(
    settings?.cancellation_limit_hours ?? 0,
  );

  if (
    !Number.isFinite(limitHours) ||
    limitHours <= 0
  ) {
    return {
      allowed: false,
      reason: "invalid_configuration" as const,
    };
  }

  if (
    reservation.status === "cancelled" ||
    reservation.status === "completed" ||
    reservation.status === "finished" ||
    reservation.status === "no_show"
  ) {
    return {
      allowed: false,
      reason: "reservation_not_cancellable" as const,
    };
  }

  const reservationDate =
    String(reservation.reservation_date);

  const reservationTime =
    String(reservation.start_time);

  const reservationDateTime =
    zonedDateTimeToUtc(
      reservationDate,
      reservationTime,
      reservation.timezone ||
        settings?.timezone ||
        "America/Guayaquil",
    );

  if (
    Number.isNaN(
      reservationDateTime.getTime(),
    )
  ) {
    return {
      allowed: false,
      reason: "invalid_reservation_datetime" as const,
    };
  }

  const cancellationDeadline =
    new Date(
      reservationDateTime.getTime() -
        limitHours * 60 * 60 * 1000,
    );

  if (
    new Date() >
    cancellationDeadline
  ) {
    return {
      allowed: false,
      reason: "deadline_passed" as const,
      deadline: cancellationDeadline.toISOString(),
    };
  }

  return {
    allowed: true,
    reservation,
    settings,
    deadline:
      cancellationDeadline.toISOString(),
  };
}
