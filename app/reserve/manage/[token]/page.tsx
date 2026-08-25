import CustomerReservationCancellation from "./CustomerReservationCancellation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams: Promise<{
    reservation?: string;
  }>;
};

export default async function CustomerReservationManagePage({
  params,
  searchParams,
}: PageProps) {
  const [{ token }, query] =
    await Promise.all([params, searchParams]);

  return (
    <CustomerReservationCancellation
      token={token}
      reservationId={query.reservation || ""}
    />
  );
}
