import crypto from "node:crypto";

import { supabaseAdmin } from "@/lib/supabase/supabase";

function getSecret() {
  const secret = process.env.RESERVATION_CUSTOMER_CANCEL_SECRET;

  if (!secret) {
    throw new Error("Falta RESERVATION_CUSTOMER_CANCEL_SECRET.");
  }

  return secret;
}

function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_ENV === "production") {
    return "https://app.wolfordering.com";
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(reservationId: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(reservationId, "utf8")
    .digest("hex");
}

/**
 * The token is self-contained: v1.<encoded reservation id>.<HMAC>.
 * The cancellation window is NOT stored in the token; it is always read
 * from the restaurant reservation settings at validation time.
 */
export function getCustomerCancellationUrl(reservationId: string) {
  const payload = base64UrlEncode(reservationId);
  const signature = createSignature(reservationId);
  const token = `v1.${payload}.${signature}`;

  return `${getSiteUrl()}/reserve/manage/${encodeURIComponent(token)}`;
}

function parseCustomerCancellationToken(token: string) {
  const parts = token.split(".");

  if (parts.length !== 3 || parts[0] !== "v1") {
    return null;
  }

  const [, payload, signature] = parts;

  if (!payload || !signature) return null;

  try {
    const reservationId = base64UrlDecode(payload);

    if (!reservationId) return null;

    return { reservationId, signature };
  } catch {
    return null;
  }
}

export function getReservationIdFromCustomerCancellationToken(token: string) {
  return parseCustomerCancellationToken(token)?.reservationId ?? null;
}

export function verifyCustomerCancellationToken(token: string) {
  const parsed = parseCustomerCancellationToken(token);

  if (!parsed) return false;

  try {
    const expected = createSignature(parsed.reservationId);
    const expectedBuffer = Buffer.from(expected, "utf8");
    const tokenBuffer = Buffer.from(parsed.signature, "utf8");

    if (expectedBuffer.length !== tokenBuffer.length) return false;

    return crypto.timingSafeEqual(expectedBuffer, tokenBuffer);
  } catch {
    return false;
  }
}

export async function canCustomerCancelWithToken(token: string) {
  const parsed = parseCustomerCancellationToken(token);

  if (!parsed || !verifyCustomerCancellationToken(token)) {
    return {
      allowed: false,
      reason: "invalid_token" as const,
    };
  }

  const reservationId = parsed.reservationId;

  const { data: reservation, error } = await supabaseAdmin
    .from("restaurant_reservations")
    .select(`
      id,
      restaurant_id,
      status,
      reservation_date,
      start_time,
      start_at,
      timezone
    `)
    .eq("id", reservationId)
    .maybeSingle();

  if (error) throw error;

  if (!reservation) {
    return {
      allowed: false,
      reason: "not_found" as const,
    };
  }

  const { data: settings, error: settingsError } =
    await supabaseAdmin
      .from("restaurant_reservation_settings")
      .select("allow_cancellations, cancellation_limit_hours, timezone")
      .eq("restaurant_id", reservation.restaurant_id)
      .maybeSingle();

  if (settingsError) throw settingsError;

  if (settings?.allow_cancellations !== true) {
    return {
      allowed: false,
      reason: "disabled" as const,
    };
  }

  const limitHours = Number(settings?.cancellation_limit_hours ?? 0);

  if (!Number.isFinite(limitHours) || limitHours <= 0) {
    return {
      allowed: false,
      reason: "invalid_configuration" as const,
    };
  }

  if (
    reservation.status === "cancelled" ||
    reservation.status === "completed" ||
    reservation.status === "finished" ||
    reservation.status === "no_show" ||
    reservation.status === "rejected" ||
    reservation.status === "expired"
  ) {
    return {
      allowed: false,
      reason: "reservation_not_cancellable" as const,
    };
  }

  let reservationDateTime: Date;

  if (reservation.start_at) {
    reservationDateTime = new Date(reservation.start_at);
  } else {
    const reservationDate = String(reservation.reservation_date);
    const reservationTime = String(reservation.start_time);
    const timezone =
      reservation.timezone ||
      settings?.timezone ||
      "America/Guayaquil";

    reservationDateTime = localDateTimeToUtc(
      reservationDate,
      reservationTime,
      timezone,
    );
  }

  if (Number.isNaN(reservationDateTime.getTime())) {
    return {
      allowed: false,
      reason: "invalid_reservation_datetime" as const,
    };
  }

  const cancellationDeadline = new Date(
    reservationDateTime.getTime() -
      limitHours * 60 * 60 * 1000,
  );

  if (Date.now() > cancellationDeadline.getTime()) {
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
    deadline: cancellationDeadline.toISOString(),
  };
}

function localDateTimeToUtc(
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
    ![year, month, day, hour, minute, second].every(
      Number.isFinite,
    )
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
