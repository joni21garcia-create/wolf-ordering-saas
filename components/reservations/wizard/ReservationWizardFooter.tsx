"use client";

import ReservationWizardNavigation from "./ReservationWizardNavigation";

export default function ReservationWizardFooter() {
  return (
    <footer
      className="
        mt-6
        border-t border-zinc-800
        bg-zinc-950/95
        pt-4
        backdrop-blur
        sm:pt-5
      "
    >
      <ReservationWizardNavigation />
    </footer>
  );
}