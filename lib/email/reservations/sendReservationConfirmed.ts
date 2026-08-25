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
  const data =
    await getReservationEmailData(
      reservationId,
    );

  if (!data.guest.email) {
    return {
      success: false,
      skipped: true,
    };
  }

  let cancellationHtml = "";

  if (data.status === "confirmed") {
    cancellationHtml =
      await buildCustomerCancellationHtml(
        reservationId,
        data.restaurant.id,
      );
  }

  const html =
    buildReservationDetailsHtml(
      data,
      {
        title: "Reserva confirmada",
        intro:
          "Tu reserva ha sido confirmada. Estos son los datos que debes conservar.",
        showCustomerContact: false,
        showStatus: true,
        extraHtml: cancellationHtml,
      },
    );

  const result =
    await resend.emails.send({
      from: RESERVATION_FROM,
      to: data.guest.email,
      subject:
        `Reserva confirmada — ${data.restaurant.name}`,
      html,
    });

  return {
    success: true,
    result,
  };
}
