import {
  RESERVATION_FROM,
  resend,
} from "../resend";
import {
  buildReservationDetailsHtml,
  getReservationEmailData,
} from "./reservationEmailData";
import { buildCustomerCancellationHtml } from "./customerCancellationEmail";

export async function sendReservationConfirmed(
  reservationId: string,
) {
  const data = await getReservationEmailData(reservationId);
  const sends: Promise<unknown>[] = [];

  let cancellationHtml = "";

  if (data.status === "confirmed" && data.guest.email) {
    cancellationHtml = await buildCustomerCancellationHtml(
      reservationId,
      data.restaurant.id,
    );
  }

  if (data.guest.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.guest.email,
        subject: `Reserva confirmada — ${data.restaurant.name}`,
        html: buildReservationDetailsHtml(data, {
          title: "Reserva confirmada",
          intro:
            "Tu reserva ha sido confirmada. Estos son los datos que debes conservar.",
          showCustomerContact: false,
          showStatus: true,
          extraHtml: cancellationHtml,
        }),
      }),
    );
  }

  if (data.restaurant.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.restaurant.email,
        subject: `Reserva confirmada — ${data.guest.name}`,
        html: buildReservationDetailsHtml(data, {
          title: "Reserva confirmada",
          intro:
            "La reserva fue confirmada. Este es el estado actualizado que debes conservar.",
          showCustomerContact: true,
          showStatus: true,
        }),
      }),
    );
  }

  if (sends.length === 0) {
    return { success: false, skipped: true };
  }

  const results = await Promise.all(sends);

  return {
    success: true,
    results,
  };
}
