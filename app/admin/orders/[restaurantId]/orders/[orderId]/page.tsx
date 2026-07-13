import { createSupabaseServerClient } from "@/lib/supabase/server";

import OrderHeader from "./components/OrderHeader";
import CustomerCard from "./components/CustomerCard";
import DeliveryCard from "./components/DeliveryCard";
import ProductsCard from "./components/ProductsCard";
import PaymentCard from "./components/PaymentCard";
import ProofCard from "./components/ProofCard";
import SummaryCard from "./components/SummaryCard";
import TimelineCard from "./components/TimelineCard";
import RestaurantCard from "./components/RestaurantCard";
import TechnicalCard from "./components/TechnicalCard";
import ActionsCard from "./components/ActionsCard";
import MapCard from "./components/MapCard";
import NotesCard from "./components/NotesCard";
import OrderStatusCard from "./components/OrderStatusCard";

interface Props {
  params: Promise<{
    restaurantId: string;
    orderId: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const { restaurantId, orderId } =
    await params;

  const supabase =
    await createSupabaseServerClient();

  /*
  ======================================================
  VALIDAR SESIÓN
  ======================================================
  */

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(authError);
  }

  if (!user) {
    return (
      <main style={errorStyle}>
        No existe una sesión activa.
      </main>
    );
  }

  /*
  ======================================================
  VALIDAR RESTAURANTE
  ======================================================
  */

  const {
    data: restaurantUser,
    error: restaurantError,
  } = await supabase
    .from("restaurant_users")
    .select(`
      restaurant_id,
      role_id
    `)
    .eq("auth_user_id", user.id)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (
    restaurantError ||
    !restaurantUser
  ) {
    return (
      <main style={errorStyle}>
        No tienes acceso a este restaurante.
      </main>
    );
  }

  /*
  ======================================================
  CONSULTAR PEDIDO
  ======================================================
  */

  const { data: order, error } =
    await supabase
      .from("orders")
      .select(`
        *,

        order_items(
          *,
          products(
            *
          )
        )
      `)
      .eq("id", orderId)
      .eq(
        "restaurant_id",
        restaurantId
      )
      .maybeSingle();

  if (error) {
    console.error(error);

    return (
      <main style={errorStyle}>
        Error obteniendo el pedido.
      </main>
    );
  }

  if (!order) {
    return (
      <main style={errorStyle}>
        Pedido no encontrado.
      </main>
    );
  }

const { data: deliverySettings } = await supabase
  .from("restaurant_delivery_settings")
  .select(`
    delivery_mode,
    delivery_fee,
    free_delivery_enabled,
    free_delivery_minimum
  `)
  .eq("restaurant_id", restaurantId)
  .maybeSingle();

  /*
  ======================================================
  PREPARACIÓN
  ======================================================
  */

  const hasDelivery =
    order.order_type === "delivery";

  const hasProof =
    !!order.payment_proof_url ||
    !!order.proof_url;

  const hasNotes =
    !!order.notes ||
    !!order.delivery_instructions;

  const hasMap =
    !!order.delivery_address;

  /*
  ======================================================
  RENDER
  ======================================================
  */

return (
  <main style={mainStyle}>
    <style>{`
      .wolf-order-layout{
        display:grid;
        grid-template-columns:minmax(0,1fr) 420px;
        gap:28px;
        align-items:start;
      }

      .wolf-order-main{
        display:flex;
        flex-direction:column;
        gap:24px;
        min-width:0;
      }

      .wolf-order-sidebar{
        display:flex;
        flex-direction:column;
        gap:24px;
        position:sticky;
        top:24px;
        align-self:start;
      }

      @media (max-width:1200px){

        .wolf-order-layout{
          grid-template-columns:1fr;
        }

        .wolf-order-sidebar{
          position:static;
          top:auto;
        }

      }

      @media (max-width:768px){

        .wolf-order-container{
          padding:16px !important;
        }

        .wolf-order-layout{
          gap:18px;
        }

        .wolf-order-main,
        .wolf-order-sidebar{
          gap:18px;
        }

      }

      @media (max-width:480px){

        .wolf-order-container{
          padding:12px !important;
        }

        .wolf-order-layout{
          gap:16px;
        }

        .wolf-order-main,
        .wolf-order-sidebar{
          gap:16px;
        }

      }
    `}</style>

    <div
      className="wolf-order-container"
      style={{
        maxWidth: 1800,
        margin: "0 auto",
        padding: 28,
      }}
    >
      <OrderHeader
        restaurantId={restaurantId}
        order={order}
      />

      <div className="wolf-order-layout">

        <div className="wolf-order-main">

          <CustomerCard order={order} />

          {hasDelivery && (
            <DeliveryCard order={order} />
          )}

          {hasMap && (
            <MapCard order={order} />
          )}

          <ProductsCard order={order} />

          {hasNotes && (
            <NotesCard order={order} />
          )}

          <TimelineCard order={order} />

          <RestaurantCard order={order} />

          <TechnicalCard order={order} />

        </div>

        <div className="wolf-order-sidebar">

          <SummaryCard
            order={order}
            deliverySettings={{
              delivery_mode:
                deliverySettings?.delivery_mode ??
                "fixed",

              delivery_fee:
                Number(
                  deliverySettings?.delivery_fee ?? 0
                ),

              free_delivery_enabled:
                deliverySettings?.free_delivery_enabled ??
                false,

              free_delivery_minimum:
                Number(
                  deliverySettings?.free_delivery_minimum ??
                    0
                ),
            }}
          />

          <PaymentCard order={order} />

          {hasProof && (
            <ProofCard order={order} />
          )}

          <OrderStatusCard order={order} />

          <ActionsCard order={order} />

        </div>

      </div>
    </div>
  </main>
);
}

/*
========================================================
ESTILOS GENERALES
========================================================
*/

const mainStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg,#050505 0%,#090909 100%)",
  padding: "30px 18px",
};

const errorStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#050505",
  color: "#fff",
  fontSize: "22px",
  fontWeight: 600,
};