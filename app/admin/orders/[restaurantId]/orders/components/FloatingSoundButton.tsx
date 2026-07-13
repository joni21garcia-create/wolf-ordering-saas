"use client";

import {
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";

interface Props {
  enabled: boolean;
  connected: boolean;
  onToggle: () => void;
}

export default function FloatingSoundButton({
  enabled,
  connected,
  onToggle,
}: Props) {
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 9999,

        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Estado realtime */}

      <div
        style={{
          width: 54,
          height: 54,

          borderRadius: 18,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          background: connected
            ? "#16a34a"
            : "#dc2626",

          color: "#fff",

          boxShadow:
            "0 15px 40px rgba(0,0,0,.35)",
        }}
      >
        {connected ? (
          <Wifi size={22} />
        ) : (
          <WifiOff size={22} />
        )}
      </div>

      {/* Sonido */}

      <button
        onClick={onToggle}
        style={{
          width: 62,
          height: 62,

          border: "none",

          cursor: "pointer",

          borderRadius: 22,

          background: enabled
            ? "#f97316"
            : "#27272a",

          color: "#fff",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          boxShadow:
            "0 20px 50px rgba(0,0,0,.45)",

          transition: ".25s",
        }}
      >
        {enabled ? (
          <Volume2 size={28} />
        ) : (
          <VolumeX size={28} />
        )}
      </button>
    </div>
  );
}