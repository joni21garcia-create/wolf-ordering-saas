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
  { value: "", label: "Todos los meses" },
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
    <section
      style={{
        marginTop: 36,
        marginBottom: 36,

        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",

        gap: 18,
      }}
    >
      <Select
        label="Mes"
        value={month}
        onChange={onMonthChange}
      >
        {MONTHS.map((m) => (
          <option
            key={m.value}
            value={m.value}
          >
            {m.label}
          </option>
        ))}
      </Select>

      <Input
        label="Año"
        value={year}
        onChange={onYearChange}
      />

      <Select
        label="Estado"
        value={status}
        onChange={onStatusChange}
      >
        <option value="">
          Todos
        </option>

        <option value="pending">
          Pendiente
        </option>

        <option value="paid">
          Pagado
        </option>
      </Select>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: any) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          border:
            "1px solid rgba(255,255,255,.08)",
          background: "#151515",
          color: "#fff",
        }}
      >
        {children}
      </select>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: any) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          border:
            "1px solid rgba(255,255,255,.08)",
          background: "#151515",
          color: "#fff",
        }}
      />
    </div>
  );
}