import ReservationStats from "./components/ReservationStats";
import ReservationPageClient from "./components/ReservationPageClient";

import { reservationRepository } from "@/modules/reservations/repositories/reservation.repository";
import { mapRestaurantReservation } from "@/modules/reservations/mappers/reservation.mapper";
import type { ReservationCalendarEvent } from "@/types/reservations";

interface Props {
  params: Promise<{
    restaurantId: string;
  }>;
}

export default async function ReservationsPage({
  params,
}: Props) {
  const { restaurantId } = await params;

  const { data } =
    await reservationRepository.list(
      restaurantId
    );

  const reservations =
    data.map(mapRestaurantReservation);

  const events: ReservationCalendarEvent[] =
    reservations.map((reservation) => ({
      id: reservation.id,
      reservationId: reservation.id,
      title: reservation.guest.fullName,
      guestName: reservation.guest.fullName,
      phone: reservation.guest.phone,
      start:
        `${reservation.datetime.date}T${reservation.datetime.startTime}`,
      end:
        `${reservation.datetime.date}T${reservation.datetime.endTime}`,
      status: reservation.status,
      guests: reservation.capacity.guests,
      durationMinutes: reservation.datetime.durationMinutes,
      typeName: reservation.typeName,
      customerNotes: reservation.customerNotes,
      checkedIn: reservation.checkIn.checked,
tableNames:
  reservation.assignment?.tables?.map(
    (table) => table.name
  ) ?? [],

tableZone:
  reservation.assignment?.tables
    ?.map((table) => table.zone)
    .filter(
      (zone): zone is string =>
        Boolean(zone)
    )
    .join(", ") ?? "",
    }));

  return (
    <main
      className="
        space-y-8
        p-4
        sm:p-6
        lg:p-8
      "
    >
      <ReservationStats
        restaurantId={restaurantId}
      />

      <ReservationPageClient
        restaurantId={restaurantId}
        reservations={reservations}
        events={events}
      />
    </main>
  );
}