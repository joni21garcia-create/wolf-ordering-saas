import ReservationHeader from "./components/ReservationHeader";
import ReservationStats from "./components/ReservationStats";
import ReservationContent from "./components/ReservationContent";

import { supabaseAdmin } from "@/lib/supabase/supabase";
import { mapRestaurantReservation } from "@/modules/reservations/mappers/reservation.mapper";

interface Props {
  params: Promise<{ restaurantId: string; }>;
}

export default async function ReservationsPage({
  params,
}: Props) {
  const { restaurantId } = await params;

  const [{ data }, { data: tables }] = await Promise.all([
    supabaseAdmin
      .from("restaurant_reservations")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("start_at", { ascending: true }),

    supabaseAdmin
      .from("restaurant_tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("code"),
  ]);

  const reservations = (data ?? []).map(mapRestaurantReservation);

  const events = reservations.map((reservation) => ({
    id: reservation.id,
    reservationId: reservation.id,
    title: reservation.guest.fullName,
    start: reservation.datetime.startTime,
    end: reservation.datetime.endTime,
    status: reservation.status,
    guests: reservation.capacity.guests,
  }));

  return (
    <main className="space-y-8 p-8">
      <ReservationHeader />

      <ReservationStats />

      <ReservationContent
        reservations={reservations}
        events={events}
      />
    </main>
  );
}




