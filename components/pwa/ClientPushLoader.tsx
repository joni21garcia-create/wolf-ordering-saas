"use client";

import ClientPushProvider from "./ClientPushProvider";

interface Props {
  restaurantId: string;
}

export default function ClientPushLoader({
  restaurantId,
}: Props) {
  return (
    <ClientPushProvider
      restaurantId={restaurantId}
    />
  );
}