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
  reason?: string | null,
) {
  const data = await getReservationEmailData(reservationId);

  const customerIntro =
    cancelledBy === "customer"
      ? "El cliente canceló esta reserva. El estado fue actualizado a cancelada."
      : "El restaurante canceló esta reserva. El estado fue actualizado a cancelada.";

  const restaurantIntro =
    cancelledBy === "customer"
      ? "El cliente canceló esta reserva. El estado fue actualizado a cancelada."
      : "La reserva fue cancelada desde el restaurante. El estado fue actualizado a cancelada.";

  const sends: Promise<unknown>[] = [];

  if (data.guest.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.guest.email,
        subject: `Reserva cancelada — ${data.restaurant.name}`,
        html: buildReservationDetailsHtml(data, {
          title: "Reserva cancelada",
          intro: customerIntro,
          showCustomerContact: false,
          showStatus: true,
          cancellationReason: reason || null,
        }),
      }),
    );
  }

  if (data.restaurant.email) {
    sends.push(
      resend.emails.send({
        from: RESERVATION_FROM,
        to: data.restaurant.email,
        subject: `Reserva cancelada — ${data.guest.name}`,
        html: buildReservationDetailsHtml(data, {
          title: "Reserva cancelada",
          intro: restaurantIntro,
          showCustomerContact: true,
          showStatus: true,
          cancellationReason: reason || null,
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
