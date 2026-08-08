"use client";

import {
  Search,
  RefreshCw,
  Truck,
  ShoppingBag,
} from "lucide-react";

import {
  WolfButton,
  WolfFlex,
  WolfInput,
  WolfSpacer,
  WolfStack,
} from "@/lib/wolf-ui";

interface Props {
  search: string;

  paymentFilter: string;

  orderTypeFilter: string;

  loading: boolean;

  onSearchChange: (
    value: string
  ) => void;

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

    return (

    <section
      style={{
        marginBottom: 18,
      }}
    >

      <WolfFlex
        align="center"
        gap="lg"
        wrap
      >
              <div
          style={{
            flex: 1,
            minWidth: 280,
            maxWidth: 560,
          }}
        >

          <WolfInput
            placeholder="Buscar cliente, teléfono o código..."

            value={search}

            onChange={(e) =>
              onSearchChange(
                e.target.value
              )
            }

            leftIcon={
              <Search size={18} />
            }
          />

        </div>
                <WolfFlex
          gap="sm"
          wrap
          align="center"
        >
                    <WolfButton
            variant={
              orderTypeFilter === "all"
                ? "primary"
                : "secondary"
            }
            size="sm"
            onClick={() =>
              onOrderTypeFilterChange("all")
            }
          >
            Todos
          </WolfButton>

          <WolfButton
            variant={
              orderTypeFilter === "delivery"
                ? "primary"
                : "secondary"
            }
            size="sm"
            leftIcon={<Truck size={15} />}
            onClick={() =>
              onOrderTypeFilterChange(
                "delivery"
              )
            }
          >
            Delivery
          </WolfButton>

          <WolfButton
            variant={
              orderTypeFilter === "pickup"
                ? "primary"
                : "secondary"
            }
            size="sm"
            leftIcon={
              <ShoppingBag size={15} />
            }
            onClick={() =>
              onOrderTypeFilterChange(
                "pickup"
              )
            }
          >
            Pickup
          </WolfButton>

        </WolfFlex>

        <WolfSpacer />

        <WolfButton
          variant="ghost"
          size="sm"
          loading={loading}
          leftIcon={
            <RefreshCw size={16} />
          }
          onClick={onRefresh}
        >
          Actualizar
        </WolfButton>

      </WolfFlex>

    </section>

  );
}