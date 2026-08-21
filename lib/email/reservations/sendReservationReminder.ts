import {
  RESERVATION_FROM,
  resend,
} from "../resend";
import {
  buildReservationDetailsHtml,
  getReservationEmailData,
} from "./reservationEmailData";

export async function sendReservationReminder(
  reservationId: string
) {
  const data =
    await getReservationEmailData(reservationId);

  if (!data.guest.email) {
    return { success: false, skipped: true };
  }

  const result = await resend.emails.send({
    from: RESERVATION_FROM,
    to: data.guest.email,
    subject: `Recordatorio de tu reserva — ${data.restaurant.name}`,
    html: buildReservationDetailsHtml(data, {
      title: "Recordatorio de tu reserva",
      intro:
        "Te recordamos que tienes una reserva próxima. Aquí están todos los detalles.",
      showCustomerContact: false,
      showStatus: true,
    }),
  });

  return { success: true, result };
}
