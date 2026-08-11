import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import OrderHeader from "./components/OrderHeader";
import OrderActionCenter from "./components/OrderActionCenter";
import ActionsCard from "./components/ActionsCard";
import OrderDetailsSheet from "./components/OrderDetailsSheet";
import OrderPrintView from "./components/OrderPrintView";

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

  const {
    data: order,
    error,
  } = await supabase
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
    .eq("restaurant_id", restaurantId)
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

  async function updatePayment(
    targetOrderId: string,
    paymentStatus: string
  ) {
    "use server";

    const actionSupabase =
      await createSupabaseServerClient();

    const {
      data: { user: actionUser },
      error: actionAuthError,
    } = await actionSupabase.auth.getUser();

    if (actionAuthError || !actionUser) {
      throw new Error("No existe una sesión activa.");
    }

    const { data: actionRestaurantUser } =
      await actionSupabase
        .from("restaurant_users")
        .select("restaurant_id")
        .eq("auth_user_id", actionUser.id)
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

    if (!actionRestaurantUser) {
      throw new Error(
        "No tienes acceso a este restaurante."
      );
    }

    const allowedPaymentStatuses = [
      "pending",
      "paid",
    ];

    if (
      !allowedPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      throw new Error(
        "Estado de pago no válido."
      );
    }

    const {
      data: updatedOrder,
      error: updateError,
    } = await actionSupabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
      })
      .eq("id", targetOrderId)
      .eq("restaurant_id", restaurantId)
      .select("id, payment_status")
      .maybeSingle();

    if (updateError) {
      console.error(
        "Error actualizando pago:",
        updateError
      );
      throw new Error(
        `No fue posible actualizar el pago: ${updateError.message}`
      );
    }

    if (!updatedOrder) {
      console.error(
        "No se actualizó ningún pedido.",
        {
          targetOrderId,
          restaurantId,
          paymentStatus,
        }
      );
      throw new Error(
        "No se actualizó el pago. El pedido no existe o la política de Supabase/RLS bloqueó la actualización."
      );
    }

    if (updatedOrder.payment_status !== paymentStatus) {
      console.error(
        "El pago no quedó con el estado solicitado.",
        {
          targetOrderId,
          expected: paymentStatus,
          received: updatedOrder.payment_status,
        }
      );
      throw new Error(
        "El pago no quedó guardado correctamente."
      );
    }

    revalidatePath(
      `/admin/orders/${restaurantId}/orders/${targetOrderId}`
    );
    revalidatePath(
      `/admin/orders/${restaurantId}/orders`
    );
  }

  const hasDelivery =
    order.order_type === "delivery";

  const hasProof = Boolean(
    order.payment_proof_url ||
    order.proof_url
  );

  const hasNotes = Boolean(
    order.notes ||
    order.delivery_instructions
  );

  const hasMap = Boolean(
    order.delivery_address
  );

  return (
    <main className="wolf-order-page">
      <style>{`
        .wolf-order-page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(249,115,22,.055),
              transparent 38%
            ),
            #050505;

          color: #fff;
        }

        .wolf-order-container {
          width: 100%;
          max-width: 760px;

          margin: 0 auto;

          padding:
            24px
            20px
            60px;
        }

        .wolf-order-content {
          display: flex;
          flex-direction: column;

          gap: 14px;
        }

        @media (max-width: 560px) {
          .wolf-order-container {
            padding:
              16px
              14px
              40px;
          }

          .wolf-order-content {
            gap: 12px;
          }
        }
      `}</style>

      <div className="wolf-order-container">
        <OrderHeader
          restaurantId={restaurantId}
          order={order}
        />

        <div className="wolf-order-content">
          <OrderActionCenter
            order={order}
          />

          <ActionsCard
            order={order}
            onUpdatePayment={updatePayment}
          />

          <OrderDetailsSheet
            order={order}
            hasDelivery={hasDelivery}
            hasMap={hasMap}
            hasNotes={hasNotes}
            hasProof={hasProof}
          />
        </div>
      </div>

      <OrderPrintView
        order={order}
      />
    </main>
  );
}

const errorStyle: React.CSSProperties = {
  minHeight: "100vh",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  padding: 24,

  background: "#050505",
  color: "#fff",

  fontSize: 16,
  fontWeight: 600,

  textAlign: "center",
};