"use client";

import { useRouter } from "next/navigation";
import { RestaurantOnboarding } from "@/modules/discover/components/onboarding/RestaurantOnboarding";

export default function RestaurantOnboardingPage() {
  const router = useRouter();

  return (
    <RestaurantOnboarding
      onClose={() => router.back()}
      onComplete={() => {
        // Próximo paso: conectar con PlansScreen.
      }}
    />
  );
}
