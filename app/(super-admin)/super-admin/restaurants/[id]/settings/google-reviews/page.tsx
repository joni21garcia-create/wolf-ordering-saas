"use client";

import { useParams } from "next/navigation";
import GoogleReviewsSettings from "./GoogleReviewsSettings";

export default function GoogleReviewsPage() {
  const params = useParams<{ id: string }>();

  return (
    <GoogleReviewsSettings
      restaurantId={params.id}
    />
  );
}