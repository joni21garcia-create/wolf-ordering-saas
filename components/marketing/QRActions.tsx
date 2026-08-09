"use client";

import type { CSSProperties } from "react";

interface Props {
  onCopy: () => void | Promise<void>;
  onShare: () => void | Promise<void>;
  onDownloadPNG: () => void;
  onDownloadPDF: () => void | Promise<void>;
}

export default function QRActions({
  onCopy,
  onShare,
  onDownloadPNG,
  onDownloadPDF,
}: Props) {
  return (
    <div style={actionsContainer}>

      {/* Acción principal */}
      <button
        type="button"
        style={shareButton}
        onClick={onShare}
      >
        Compartir menú
      </button>

      {/* Acciones secundarias */}
      <div style={secondaryActions}>

        <button
          type="button"
          style={secondaryButton}
          onClick={onCopy}
        >
          <span style={icon}>↗</span>
          Copiar
        </button>

        <button
          type="button"
          style={secondaryButton}
          onClick={onDownloadPNG}
        >
          <span style={icon}>↓</span>
          PNG
        </button>

        <button
          type="button"
          style={secondaryButton}
          onClick={onDownloadPDF}
        >
          <span style={icon}>↓</span>
          PDF
        </button>

      </div>

    </div>
  );
}

const actionsContainer: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const shareButton: CSSProperties = {
  width: "100%",
  minHeight: 48,
  border: "none",
  borderRadius: 14,
  background: "#f97316",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
};

const secondaryActions: CSSProperties = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
};

const secondaryButton: CSSProperties = {
  minHeight: 44,
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 12,
  background: "#111827",
  color: "#d1d5db",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
};

const icon: CSSProperties = {
  fontSize: 14,
  color: "#f97316",
};