"use client";

import { InstallButton } from "@/components/pwa/InstallButton";

export function LoginFooter() {
  return (
    <div
      style={{
        marginTop: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        alignItems: "center",
      }}
    >
      <InstallButton />

      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "rgba(255,255,255,.06)",
        }}
      />

      <div
        style={{
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "13px",
            letterSpacing: "1px",
          }}
        >
          Wolf Ordering OS
        </p>

        <p
          style={{
            marginTop: "8px",
            color: "#555",
            fontSize: "12px",
          }}
        >
          Versión 1.0.0
        </p>

        <p
          style={{
            marginTop: "8px",
            color: "#444",
            fontSize: "12px",
          }}
        >
          © {new Date().getFullYear()} Wolf
          Technologies
        </p>
      </div>
    </div>
  );
}