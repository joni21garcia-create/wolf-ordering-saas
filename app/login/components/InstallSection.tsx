"use client";

import { InstallButton } from "@/components/pwa/InstallButton";

export default function InstallSection() {
  return (
    <div
      style={{
        marginTop: "28px",
        paddingTop: "24px",
        borderTop: "1px solid rgba(255,255,255,.06)",
      }}
    >
      <InstallButton />
    </div>
  );
}