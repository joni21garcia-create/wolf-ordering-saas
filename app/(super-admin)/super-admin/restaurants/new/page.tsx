"use client";

import PermissionGuard from "@/components/auth/PermissionGuard";

import NewRestaurantHeader from "./components/NewRestaurantHeader";
import NewRestaurantWizard from "./components/NewRestaurantWizard";

export default function NewRestaurantPage() {
  return (
    <PermissionGuard permission="restaurants">
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top right,#351400 0%,#050505 45%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1700,
            margin: "0 auto",
            padding: "40px 28px 70px",
          }}
        >
          <NewRestaurantHeader
           currentStep={1}
           totalSteps={7}
          />

          <NewRestaurantWizard />
        </div>
      </main>
    </PermissionGuard>
  );
}


