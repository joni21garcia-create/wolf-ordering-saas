export type CustomerOrderStatus =
  | "accepted"
  | "preparing"
  | "ready"
  | "on_the_way"
  | "completed"
  | "cancelled";

export const CUSTOMER_MESSAGES: Record<
  CustomerOrderStatus,
  {
    body: string;
  }
> = {
  accepted: {
    body: "✅ Tu pedido fue aceptado por el restaurante.",
  },

  preparing: {
    body: "👨‍🍳 Estamos preparando tu pedido.",
  },

  ready: {
    body: "📦 Tu pedido está listo.",
  },

  on_the_way: {
    body: "🛵 Tu pedido va en camino.",
  },

  completed: {
    body: "🎉 Tu pedido fue entregado. ¡Gracias por tu compra!",
  },

  cancelled: {
    body: "❌ El restaurante canceló tu pedido.",
  },
};