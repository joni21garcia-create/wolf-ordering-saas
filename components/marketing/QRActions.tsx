"use client";

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
    <div
      style={{
        display: "grid",
        gap: 14,
      }}
    >
      <button
        style={primaryButton}
        onClick={onCopy}
      >
        📋 Copiar enlace
      </button>

      <button
        style={primaryButton}
        onClick={onShare}
      >
        📤 Compartir
      </button>

      <button
        style={primaryButton}
        onClick={onDownloadPNG}
      >
        🖼 Descargar PNG
      </button>

      <button
        style={primaryButton}
        onClick={onDownloadPDF}
      >
        📄 Descargar PDF
      </button>
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: 14,
  cursor: "pointer",
  background: "#f97316",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 14,
  transition: "all .25s ease",
};