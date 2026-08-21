import { ReservationSettingsPage } from "@/modules/reservations/components/settings/ReservationSettingsPage";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReservationsSettingsPage({
  params,
}: PageProps) {
  const { id: restaurantId } = await params;

  return (
    <ReservationSettingsPage
      restaurantId={restaurantId}
    />
  );
}