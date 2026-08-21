"use client";

interface Props {
  month: string;
  year: string;
  status: string;
  onMonthChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const MONTHS = [
  { value: "", label: "Todos" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

export default function FinanceFilters({
  month,
  year,
  status,
  onMonthChange,
  onYearChange,
  onStatusChange,
}: Props) {
  return (
    <section className="filters">
      <style jsx>{`
        .filters {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 24px 0;
        }

        .field {
          min-width: 0;
        }

        .label {
          margin-bottom: 7px;
          color: #777;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        select,
        input {
          width: 100%;
          box-sizing: border-box;
          min-height: 42px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08);
          background: #151515;
          color: #fff;
          font-size: 13px;
          outline: none;
        }

        select:focus,
        input:focus {
          border-color: rgba(249,115,22,.45);
        }

        @media(max-width:700px){
          .filters {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

      <Field label="Mes">
        <select value={month} onChange={(e) => onMonthChange(e.target.value)}>
          {MONTHS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Año">
        <input
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        />
      </Field>

      <Field label="Estado">
        <select value={status} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="paid">Pagado</option>
        </select>
      </Field>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="label">{label}</div>
      {children}
    </div>
  );
}