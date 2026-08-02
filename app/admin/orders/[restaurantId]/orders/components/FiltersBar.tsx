"use client";

import {
  Search,
  RotateCw,
  SlidersHorizontal,
} from "lucide-react";

import WolfButton from "@/components/ui/WolfButton";

import {
  cardStyle,
  colors,
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

        padding: 24,

        marginBottom: 26,

        borderRadius: 22,

        border:
          "1px solid rgba(255,255,255,.05)",

        background:
          "linear-gradient(180deg,#171717,#101010)",

        boxShadow:
          "0 20px 45px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr 1fr auto",
          gap: 18,
          alignItems: "center",
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
              left: 16,
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
            placeholder="Buscar pedido o cliente..."
            style={{
              width: "100%",

              height: 54,

              paddingLeft: 48,

              paddingRight: 16,

              borderRadius: 16,

              border:
                "1px solid rgba(255,255,255,.06)",

              background:
                "#1a1a1a",

              color: "#fff",

              outline: "none",

              fontSize: 15,

              transition:
                ".25s",
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
          style={{
            height: 54,

            borderRadius: 16,

            border:
              "1px solid rgba(255,255,255,.06)",

            background:
              "#1a1a1a",

            color: "#fff",

            padding: "0 16px",

            fontSize: 14,

            cursor: "pointer",
          }}
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
          style={{
            height: 54,

            borderRadius: 16,

            border:
              "1px solid rgba(255,255,255,.06)",

            background:
              "#1a1a1a",

            color: "#fff",

            padding: "0 16px",

            fontSize: 14,

            cursor: "pointer",
          }}
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

        <WolfButton
          variant="primary"
          onClick={onRefresh}
          disabled={loading}
          style={{
            minWidth: 170,
            height: 54,
          }}
        >
          {loading ? (
            <>
              <RotateCw
                size={18}
                className="animate-spin"
              />
              &nbsp;Actualizando...
            </>
          ) : (
            <>
              <SlidersHorizontal
                size={18}
              />
              &nbsp;Actualizar
            </>
          )}
        </WolfButton>
      </div>
    </section>
  );
}