import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/supabase";
import {
  canCustomerCancelWithToken,
  getReservationIdFromCustomerCancellationToken,
} from "@/lib/reservations/customer-cancellation-token";
import { sendReservationCancelled } from "@/lib/email/reservations/sendReservationCancelled";

type RouteContext = {
  params: Promise<{ token: string }>;
};

function reasonMessage(reason: string | undefined) {
  switch (reason) {
    case "invalid_token":
      return "El enlace de cancelación no es válido.";
    case "not_found":
      return "No encontramos esta reserva.";
    case "disabled":
      return "El restaurante no permite cancelaciones de clientes.";
    case "invalid_configuration":
      return "La configuración de cancelaciones del restaurante no es válida.";
    case "deadline_passed":
      return "El plazo permitido para cancelar esta reserva ya venció.";
    case "reservation_not_cancellable":
      return "Esta reserva ya no puede cancelarse por su estado actual.";
    case "invalid_reservation_datetime":
      return "No pudimos determinar correctamente la fecha de la reserva.";
    default:
      return "No es posible cancelar esta reserva.";
  }
}

async function validateRequest(token: string) {
  const reservationId =
    getReservationIdFromCustomerCancellationToken(token);

  if (!reservationId) {
    return {
      ok: false as const,
      status: 404,
      message: reasonMessage("invalid_token"),
    };
  }

  const cancellation =
    await canCustomerCancelWithToken(token);

  if (!cancellation.allowed) {
    return {
      ok: false as const,
      status:
        cancellation.reason === "invalid_token" ||
        cancellation.reason === "not_found"
          ? 404
          : 409,
      message: reasonMessage(cancellation.reason),
      cancellation,
    };
  }

  return {
    ok: true as const,
    reservationId,
    cancellation,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { token } = await context.params;
    const validation = await validateRequest(token);

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
          cancellation: validation.cancellation,
        },
        { status: validation.status },
      );
    }

    const { reservationId, cancellation } = validation;

    const { data: reservation, error } =
      await supabaseAdmin
        .from("restaurant_reservations")
        .select(`
          id,
          status,
          confirmation_code,
          customer_name,
          reservation_date,
          start_time,
          end_time
        `)
        .eq("id", reservationId)
        .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        status: reservation.status,
        confirmationCode: reservation.confirmation_code,
        guest: { fullName: reservation.customer_name },
        datetime: {
          date: reservation.reservation_date,
          startTime: reservation.start_time,
          endTime: reservation.end_time,
        },
      },
      cancellation: {
        allowed: cancellation.allowed,
        deadline: cancellation.deadline,
      },
    });
  } catch (error) {
    console.error("CUSTOMER RESERVATION CANCELLATION GET ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "No pudimos cargar la información de la reserva.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { token } = await context.params;
    const validation = await validateRequest(token);

    if (!validation.ok) {
      return NextResponse.json(
        {
          success: false,
          message: validation.message,
          cancellation: validation.cancellation,
        },
        { status: validation.status },
      );
    }

    const { reservationId, cancellation } = validation;

    if (!cancellation.reservation) {
      return NextResponse.json(
        { success: false, message: "No encontramos esta reserva." },
        { status: 404 },
      );
    }

    const previousStatus = cancellation.reservation.status;

    const { data: updatedReservation, error } =
      await supabaseAdmin
        .from("restaurant_reservations")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", reservationId)
        .in("status", ["pending", "confirmed"])
        .select(`
          id,
          restaurant_id,
          status,
          confirmation_code,
          customer_name,
          reservation_date,
          start_time,
          end_time
        `)
        .maybeSingle();

    if (error) throw error;

    if (!updatedReservation) {
      return NextResponse.json(
        {
          success: false,
          message: "La reserva ya no puede cancelarse porque su estado cambió.",
        },
        { status: 409 },
      );
    }

    const { error: logError } =
      await supabaseAdmin
        .from("restaurant_reservation_logs")
        .insert({
          reservation_id: reservationId,
          restaurant_id: updatedReservation.restaurant_id,
          action: "cancelled",
          previous_status: previousStatus,
          new_status: "cancelled",
          actor_type: "customer",
          message: "La reserva fue cancelada por el cliente mediante el enlace de confirmación.",
          metadata: { source: "customer_cancellation_link" },
        });

    if (logError) {
      console.error("CUSTOMER RESERVATION CANCELLATION LOG ERROR:", logError);
    }

    try {
      await sendReservationCancelled(reservationId, "customer");
    } catch (emailError) {
      console.error("CUSTOMER RESERVATION CANCELLATION EMAIL ERROR:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Tu reserva fue cancelada correctamente.",
      reservation: {
        id: updatedReservation.id,
        status: updatedReservation.status,
        confirmationCode: updatedReservation.confirmation_code,
        guest: { fullName: updatedReservation.customer_name },
        datetime: {
          date: updatedReservation.reservation_date,
          startTime: updatedReservation.start_time,
          endTime: updatedReservation.end_time,
        },
      },
      cancellation: { allowed: false },
    });
  } catch (error) {
    console.error("CUSTOMER RESERVATION CANCELLATION POST ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: "No pudimos cancelar la reserva. Inténtalo nuevamente.",
      },
      { status: 500 },
    );
  }
}
