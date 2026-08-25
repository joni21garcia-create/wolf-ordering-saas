import {
  RESERVATION_FROM,
  resend,
} from "../resend";
import {
  buildReservationDetailsHtml,
  getReservationEmailData,
} from "./reservationEmailData";

export type ReservationCancelledBy =
  | "customer"
  | "restaurant";

export async function sendReservationCancelled(
  reservationId: string,
  cancelledBy: ReservationCancelledBy,
  reason?: string | null
) {
  const data =
    await getReservationEmailData(reservationId);

  const recipient =
    cancelledBy === "customer"
      ? data.restaurant.email
      : data.guest.email;

  if (!recipient) {
    return { success: false, skipped: true };
  }

  const recipientLabel =
    cancelledBy === "customer"
      ? "El cliente canceló la reserva."
      : "El restaurante canceló la reserva.";

  const result = await resend.emails.send({
    from: RESERVATION_FROM,
    to: recipient,
    subject: `Reserva cancelada — ${data.restaurant.name}`,
    html: buildReservationDetailsHtml(data, {
      title: "Reserva cancelada",
      intro: recipientLabel,
      showCustomerContact: cancelledBy === "customer",
      showStatus: true,
      cancellationReason: reason || null,
    }),
  });

  return { success: true, result };
}