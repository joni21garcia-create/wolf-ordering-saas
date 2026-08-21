import {
  RESERVATION_FROM,
  resend,
} from "../resend";
import {
  buildReservationDetailsHtml,
  getReservationEmailData,
} from "./reservationEmailData";

export async function sendReservationConfirmed(
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
    subject: `Reserva confirmada — ${data.restaurant.name}`,
    html: buildReservationDetailsHtml(data, {
      title: "Reserva confirmada",
      intro:
        "Tu reserva ha sido confirmada. Estos son los datos que debes conservar.",
      showCustomerContact: false,
      showStatus: true,
    }),
  });

  return { success: true, result };
}
