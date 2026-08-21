import {
  RESERVATION_FROM,
  resend,
} from "../resend";
import {
  buildReservationDetailsHtml,
  getReservationEmailData,
} from "./reservationEmailData";

export async function sendReservationCreated(
  reservationId: string
) {
  const data =
    await getReservationEmailData(reservationId);

  const sends: Promise<unknown>[] = [];

  if (data.guest.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.guest.email,
        subject:
          data.status === "confirmed"
            ? `Reserva confirmada — ${data.restaurant.name}`
            : `Solicitud de reserva — ${data.restaurant.name}`,
        html: buildReservationDetailsHtml(data, {
          title:
            data.status === "confirmed"
              ? "Reserva confirmada"
              : "Recibimos tu reserva",
          intro:
            data.status === "confirmed"
              ? "Tu reserva fue confirmada automáticamente. Conserva este correo con todos los datos."
              : "Tu solicitud fue registrada correctamente. Conserva este correo con los datos de tu reserva.",
          showCustomerContact: false,
          showStatus: true,
        }),
      })
    );
  }

  if (data.restaurant.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.restaurant.email,
        subject:
          data.status === "confirmed"
            ? `Nueva reserva confirmada — ${data.guest.name}`
            : `Nueva reserva — ${data.guest.name}`,
        html: buildReservationDetailsHtml(data, {
          title:
            data.status === "confirmed"
              ? "Nueva reserva confirmada"
              : "Nueva reserva recibida",
          intro:
            data.status === "confirmed"
              ? "Se registró una nueva reserva que quedó confirmada automáticamente."
              : "Se registró una nueva reserva en tu restaurante.",
          showCustomerContact: true,
          showStatus: true,
        }),
      })
    );
  }

  if (sends.length === 0) {
    return { success: false, skipped: true };
  }

  const results = await Promise.all(sends);
  return { success: true, results };
}
