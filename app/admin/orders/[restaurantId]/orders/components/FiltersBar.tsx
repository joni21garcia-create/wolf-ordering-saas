"use client";

import {
  Search,
  RefreshCw,
  Truck,
  ShoppingBag,
  CreditCard,
} from "lucide-react";

import {
  WolfButton,
  WolfFlex,
  WolfInput,
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
        marginBottom:18,
      }}
    >

      <WolfFlex
        align="center"
        gap="lg"
        wrap
      >

        <div
          style={{
            flex:"1 1 320px",
            minWidth:240,
            maxWidth:560,
          }}
        >

          <WolfInput
            placeholder="Buscar cliente, teléfono o código..."

            value={search}

            onChange={(e)=>
              onSearchChange(
                e.target.value
              )
            }

            leftIcon={
              <Search size={18}/>
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
              orderTypeFilter==="all"
              ? "primary"
              : "secondary"
            }
            size="sm"
            onClick={()=>
              onOrderTypeFilterChange("all")
            }
          >
            Todos
          </WolfButton>


          <WolfButton
            variant={
              orderTypeFilter==="delivery"
              ? "primary"
              : "secondary"
            }
            size="sm"
            leftIcon={
              <Truck size={15}/>
            }
            onClick={()=>
              onOrderTypeFilterChange("delivery")
            }
          >
            Delivery
          </WolfButton>


          <WolfButton
            variant={
              orderTypeFilter==="pickup"
              ? "primary"
              : "secondary"
            }
            size="sm"
            leftIcon={
              <ShoppingBag size={15}/>
            }
            onClick={()=>
              onOrderTypeFilterChange("pickup")
            }
          >
            Pickup
          </WolfButton>


          <WolfButton
            variant={
              paymentFilter==="paid"
              ? "primary"
              : "secondary"
            }
            size="sm"
            leftIcon={
              <CreditCard size={15}/>
            }
            onClick={()=>
              onPaymentFilterChange(
                paymentFilter==="paid"
                ? "all"
                : "paid"
              )
            }
          >
            Pagados
          </WolfButton>


        </WolfFlex>


        <WolfButton
          variant="ghost"
          size="sm"
          loading={loading}
          leftIcon={
            <RefreshCw size={16}/>
          }
          onClick={onRefresh}
        >
          Actualizar
        </WolfButton>


      </WolfFlex>


    </section>
  );
}