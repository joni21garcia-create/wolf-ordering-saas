"use client";

import {
  Search,
  RotateCw,
  Filter,
} from "lucide-react";

import {
  buttonStyle,
  cardStyle,
  colors,
  inputStyle,
} from "./styles";

interface Props {
  search: string;

  paymentFilter: string;

  orderTypeFilter: string;

  loading: boolean;

  onSearchChange: (value: string) => void;

  onPaymentFilterChange: (
    value: string
  ) => void;

  onOrderTypeFilterChange: (
    value: string
  ) => void;

  onRefresh: () => void;
}

export default function FiltersBar({
  search,
  paymentFilter,
  orderTypeFilter,
  loading,
  onSearchChange,
  onPaymentFilterChange,
  onOrderTypeFilterChange,
  onRefresh,
}: Props) {
  return (
    <section
      style={{
        ...cardStyle,
        padding: 20,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr 1fr auto",
          gap: 16,
        }}
      >
        {/* BUSCADOR */}

        <div
          style={{
            position: "relative",
          }}
        >
          <Search
            size={18}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform:
                "translateY(-50%)",
              color:
                colors.textSecondary,
            }}
          />

          <input
            value={search}
            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }
            placeholder="Buscar pedido, cliente..."
            style={{
              ...inputStyle,
              paddingLeft: 42,
            }}
          />
        </div>

        {/* PAGO */}

        <select
          value={paymentFilter}
          onChange={(e) =>
            onPaymentFilterChange(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="all">
            Todos los pagos
          </option>

          <option value="pending">
            Pendiente
          </option>

          <option value="paid">
            Pagado
          </option>

          <option value="refunded">
            Reembolsado
          </option>
        </select>

        {/* TIPO */}

        <select
          value={orderTypeFilter}
          onChange={(e) =>
            onOrderTypeFilterChange(
              e.target.value
            )
          }
          style={inputStyle}
        >
          <option value="all">
            Todos
          </option>

          <option value="delivery">
            Delivery
          </option>

          <option value="pickup">
            Pickup
          </option>

          <option value="table">
            Mesa
          </option>
        </select>

        {/* BOTÓN */}

        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            ...buttonStyle,
            background:
              colors.orange,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 150,
            justifyContent: "center",
          }}
        >
          {loading ? (
            <>
              <RotateCw
                size={18}
                className="animate-spin"
              />

              Actualizando
            </>
          ) : (
            <>
              <Filter size={18} />

              Actualizar
            </>
          )}
        </button>
      </div>
    </section>
  );
}