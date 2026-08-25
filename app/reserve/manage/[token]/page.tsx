import CustomerReservationCancellation from "./CustomerReservationCancellation";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function CustomerReservationManagePage({
  params,
}: PageProps) {
  const { token } = await params;

  return (
    <CustomerReservationCancellation
      token={token}
    />
  );
}