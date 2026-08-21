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

    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);

    const query = params.toString();
    router.push(query ? `?${query}` : "?");
  }

  function clearFilters() {
    setFromDate("");
    setToDate("");
    router.push("?");
  }

  return (
    <section className="filters">
      <style jsx>{`
        .filters {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.015)
            );
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 16px;
          margin-bottom: 22px;
        }

        .inner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto auto;
          gap: 10px;
          align-items: end;
        }

        .field {
          min-width: 0;
        }

        .label {
          color: #888;
          margin: 0 0 7px 3px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          height: 46px;
          padding: 0 13px;
          border-radius: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: #fff;
          outline: none;
          font-size: 14px;
          color-scheme: dark;
        }

        .input:focus {
          border-color: rgba(249, 115, 22, 0.65);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
        }

        .button {
          height: 46px;
          padding: 0 17px;
          border-radius: 13px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition:
            transform 0.15s ease,
            opacity 0.15s ease;
        }

        .button:active {
          transform: scale(0.98);
        }

        .primary {
          border: none;
          background: #f97316;
          color: #fff;
        }

        .secondary {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: #ddd;
        }

        @media (max-width: 700px) {
          .filters {
            border-radius: 18px;
            padding: 12px;
            margin-bottom: 18px;
          }

          .inner {
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .actions {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 9px;
          }

          .button {
            width: 100%;
          }
        }

        @media (max-width: 390px) {
          .inner {
            grid-template-columns: 1fr;
          }

          .actions {
            grid-column: auto;
          }

          .input,
          .button {
            height: 44px;
          }
        }
      `}</style>

      <div className="inner">
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

        <div className="actions">
          <button
            type="button"
            onClick={applyFilters}
            className="button primary"
          >
            Consultar
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="button secondary"
          >
            Limpiar
          </button>
        </div>
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
    <div className="field">
      <div className="label">{label}</div>

      <input
        className="input"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}