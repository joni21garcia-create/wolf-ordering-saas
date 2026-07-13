"use client";

import { CheckCircle2, X } from "lucide-react";

import {
  colors,
  cardStyle,
} from "./styles";

interface Props {
  open: boolean;

  title: string;

  message: string;

  onClose: () => void;
}

export default function NotificationToast({
  open,
  title,
  message,
  onClose,
}: Props) {
  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",

        top: 24,

        right: 24,

        width: 360,

        zIndex: 99999,

        animation:
          "toastIn .25s ease",
      }}
    >
      <div
        style={{
          ...cardStyle,

          padding: 18,

          display: "flex",

          gap: 16,

          alignItems: "flex-start",

          borderLeft:
            `4px solid ${colors.green}`,
        }}
      >
        <div
          style={{
            color: colors.green,

            marginTop: 2,
          }}
        >
          <CheckCircle2 size={24} />
        </div>

        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              fontWeight: 800,

              marginBottom: 6,

              fontSize: 16,
            }}
          >
            {title}
          </div>

          <div
            style={{
              color:
                colors.textSecondary,

              lineHeight: 1.5,

              fontSize: 14,
            }}
          >
            {message}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            border: "none",

            background: "transparent",

            cursor: "pointer",

            color:
              colors.textSecondary,
          }}
        >
          <X size={18} />
        </button>
      </div>

      <style jsx>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}