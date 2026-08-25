import { reservationRepository } from "../repositories/reservation.repository";
import { sendReservationConfirmed } from "@/lib/email/reservations/sendReservationConfirmed";

export async function confirmReservationAndNotify(
  reservationId: string,
) {
  if (!reservationId) {
    throw new Error("reservationId es obligatorio.");
  }

  const current =
    await reservationRepository.findById(reservationId);

  if (!current) {
    throw new Error("La reserva no existe.");
  }

  if (current.status === "confirmed") {
    return current;
  }

  const reservation =
    await reservationRepository.confirm(reservationId);

  await sendReservationConfirmed(reservationId);

  return reservation;
}
