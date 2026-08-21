import { notFound } from "next/navigation";

import { getRestaurant } from "@/lib/restaurants/getRestaurant";
import ReservationCustomerPage from "./ReservationCustomerPage";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ReservationPage({
  params,
}: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurant(slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <ReservationCustomerPage
      restaurantId={restaurant.id}
      restaurantName={restaurant.name}
      slug={slug}
    />
  );
}