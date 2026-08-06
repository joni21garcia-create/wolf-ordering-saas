"use client";

import { useState } from "react";

import {
  Search,
  RefreshCw,
  Truck,
  ShoppingBag,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";

import {
  cardStyle,
} from "./styles";

import "./filters-bar.css";

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
  orderTypeFilter,
  loading,
  onSearchChange,
  onOrderTypeFilterChange,
  onRefresh,
}: Props) {

  const [open, setOpen] = useState(true);

  return (
    <section
      style={{
        ...cardStyle,
        marginBottom: 20,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,.05)",
        background:
          "linear-gradient(180deg,#161616,#0d0d0d)",
        boxShadow:
          "0 12px 30px rgba(0,0,0,.3)",
        overflow: "hidden",
      }}
    >
      {/* CABECERA */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          <SlidersHorizontal size={18} />
          Filtros
        </div>

        {open ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}
      </button>

      {/* CONTENIDO */}
      {open && (
        <div
          style={{
            padding: "0 20px 18px",
          }}
        >
          <div className="wolf-toolbar">
            {/* FILA 1 */}
            <div className="wolf-spotlight">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) =>
                  onSearchChange(
                    e.target.value
                  )
                }
                placeholder="Buscar por cliente, teléfono o código..."
              />
            </div>

            {/* FILA 2 */}
<button
  type="button"
  className={`wolf-chip${
    orderTypeFilter === "all"
      ? " is-active"
      : ""
  }`}
onClick={() =>
  onOrderTypeFilterChange("all")
}
>
  <LayoutGrid size={14} />
  Todos
</button>

            <div className="wolf-chip-row">
              <button
                type="button"
                className={`wolf-chip${
                  orderTypeFilter ===
                  "delivery"
                    ? " is-active"
                    : ""
                }`}
                onClick={() =>
                  onOrderTypeFilterChange(
                    "delivery"
                  )
                }
              >
                <Truck size={14} />
                Delivery
              </button>

              <button
                type="button"
                className={`wolf-chip${
                  orderTypeFilter ===
                  "pickup"
                    ? " is-active"
                    : ""
                }`}
                onClick={() =>
                  onOrderTypeFilterChange(
                    "pickup"
                  )
                }
              >
                <ShoppingBag size={14} />
                Pickup
              </button>

              <div className="wolf-chip-spacer" />

              <button
                type="button"
                className="wolf-ghost-refresh"
                onClick={onRefresh}
                disabled={loading}
                aria-label={
                  loading
                    ? "Actualizando..."
                    : "Actualizar"
                }
                title={
                  loading
                    ? "Actualizando..."
                    : "Actualizar"
                }
              >
                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}