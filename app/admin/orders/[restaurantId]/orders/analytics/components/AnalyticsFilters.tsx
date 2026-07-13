"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  from?: string;
  to?: string;
}

export default function AnalyticsFilters({
  from = "",
  to = "",
}: Props) {
  const router = useRouter();

  const [fromDate, setFromDate] = useState(from);
  const [toDate, setToDate] = useState(to);

  function applyFilters() {
    const params = new URLSearchParams();

    if (fromDate) {
      params.set("from", fromDate);
    }

    if (toDate) {
      params.set("to", toDate);
    }

    router.push(`?${params.toString()}`);
  }

  function clearFilters() {
    setFromDate("");
    setToDate("");

    router.push("?");
  }

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",

        border: "1px solid rgba(255,255,255,.07)",

        borderRadius: 26,

        padding: 24,

        marginBottom: 28,
      }}
    >
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",

          gap: 18,

          alignItems: "end",
        }}
      >
        <Field
          label="Desde"
          value={fromDate}
          onChange={setFromDate}
        />

        <Field
          label="Hasta"
          value={toDate}
          onChange={setToDate}
        />

        <button
          onClick={applyFilters}
          style={primaryButton}
        >
          Consultar
        </button>

        <button
          onClick={clearFilters}
          style={secondaryButton}
        >
          Limpiar
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {label}
      </div>

      <input
        type="date"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",

          padding: "14px 16px",

          borderRadius: 14,

          border:
            "1px solid rgba(255,255,255,.08)",

          background:
            "rgba(255,255,255,.03)",

          color: "#fff",

          outline: "none",

          fontSize: 15,
        }}
      />
    </div>
  );
}

const primaryButton: React.CSSProperties = {
  height: 52,

  border: "none",

  borderRadius: 14,

  background: "#f97316",

  color: "#fff",

  fontWeight: 700,

  cursor: "pointer",

  fontSize: 15,
};

const secondaryButton: React.CSSProperties = {
  height: 52,

  borderRadius: 14,

  border: "1px solid rgba(255,255,255,.08)",

  background: "transparent",

  color: "#fff",

  cursor: "pointer",

  fontWeight: 700,

  fontSize: 15,
};