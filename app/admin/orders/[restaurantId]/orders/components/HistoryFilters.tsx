"use client";

interface Props {
  search: string;
  onSearch: (value: string) => void;

  from?: string;
  onFrom?: (value: string) => void;

  to?: string;
  onTo?: (value: string) => void;

  status?: string;
  onStatus?: (value: string) => void;

  payment?: string;
  onPayment?: (value: string) => void;

  orderType?: string;
  onOrderType?: (value: string) => void;

  onClear: () => void;
}

export default function HistoryFilters({
  search,
  onSearch,

  from,
  onFrom,

  to,
  onTo,

  status,
  onStatus,

  payment,
  onPayment,

  orderType,
  onOrderType,

  onClear,
}: Props) {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",
          gap: 18,
        }}
      >
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={onSearch}
        />

        {from !== undefined && (
          <Input
            type="date"
            value={from}
            onChange={onFrom ?? (() => {})}
          />
        )}

        {to !== undefined && (
          <Input
            type="date"
            value={to}
            onChange={onTo ?? (() => {})}
          />
        )}

        {status !== undefined && (
          <Select
            value={status}
            onChange={onStatus ?? (() => {})}
            options={[
              ["", "Todos los estados"],
              ["pending", "Pendiente"],
              ["accepted", "Aceptado"],
              ["preparing", "Preparando"],
              ["ready", "Listo"],
              ["completed", "Completado"],
              ["cancelled", "Cancelado"],
            ]}
          />
        )}

        {payment !== undefined && (
          <Select
            value={payment}
            onChange={onPayment ?? (() => {})}
            options={[
              ["", "Todos los pagos"],
              ["pending", "Pendiente"],
              ["paid", "Pagado"],
              ["refunded", "Reembolsado"],
            ]}
          />
        )}

        {orderType !== undefined && (
          <Select
            value={orderType}
            onChange={onOrderType ?? (() => {})}
            options={[
              ["", "Todos"],
              ["delivery", "Delivery"],
              ["pickup", "Pickup"],
              ["dine_in", "Mesa"],
            ]}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <button
          onClick={onClear}
          style={{
            padding: "12px 22px",
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            background: "#f97316",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
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
          "rgba(255,255,255,.04)",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        boxSizing: "border-box",
      }}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[][];
}) {
  return (
    <select
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
          "rgba(255,255,255,.04)",
        color: "#fff",
        outline: "none",
        fontSize: 14,
        boxSizing: "border-box",
      }}
    >
      {options.map(([value, label]) => (
        <option
          key={value}
          value={value}
          style={{
            background: "#111",
          }}
        >
          {label}
        </option>
      ))}
    </select>
  );
}