export interface FinancialMetrics {
  sales: {
    today: number;
    week: number;
    month: number;
  };

  wolf: {
    today: number;
    week: number;
    month: number;
  };

  restaurant: {
    today: number;
    week: number;
    month: number;
  };

  totalOrders: number;

  averageTicket: number;

  ordersToday: any[];

  ordersWeek: any[];

  ordersMonth: any[];
}

export function buildFinancialMetrics(
  orders: any[],
  liquidation?: {
    sales_total?: number;
    wolf_total?: number;
    restaurant_total?: number;
    total_orders?: number;
  } | null
): FinancialMetrics {

  const today = new Date();

  const startOfDay =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  const startOfWeek =
    new Date(today);

  startOfWeek.setDate(
    today.getDate() -
      today.getDay()
  );

  const startOfMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

  const endOfMonth =
    new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

  const ordersToday =
    orders.filter((order) =>
      new Date(order.created_at) >=
      startOfDay
    );

  const ordersWeek =
    orders.filter((order) =>
      new Date(order.created_at) >=
      startOfWeek
    );

  const ordersMonth =
    orders.filter((order) => {

      const date =
        new Date(order.created_at);

      return (
        date >= startOfMonth &&
        date < endOfMonth
      );

    });

  const salesToday =
    ordersToday.reduce(
      (acc, order) =>
        acc +
        Number(order.total || 0),
      0
    );

  const salesWeek =
    ordersWeek.reduce(
      (acc, order) =>
        acc +
        Number(order.total || 0),
      0
    );

  const salesMonth =
    liquidation
      ? Number(
          liquidation.sales_total ??
            0
        )
      : ordersMonth.reduce(
          (acc, order) =>
            acc +
            Number(
              order.total || 0
            ),
          0
        );

  const wolfToday =
    ordersToday.reduce(
      (acc, order) =>
        acc +
        Number(
          order.wolf_amount || 0
        ),
      0
    );

  const wolfWeek =
    ordersWeek.reduce(
      (acc, order) =>
        acc +
        Number(
          order.wolf_amount || 0
        ),
      0
    );

  const wolfMonth =
    liquidation
      ? Number(
          liquidation.wolf_total ??
            0
        )
      : ordersMonth.reduce(
          (acc, order) =>
            acc +
            Number(
              order.wolf_amount ||
                0
            ),
          0
        );

  const restaurantToday =
    ordersToday.reduce(
      (acc, order) =>
        acc +
        Number(
          order.restaurant_amount ||
            0
        ),
      0
    );

  const restaurantWeek =
    ordersWeek.reduce(
      (acc, order) =>
        acc +
        Number(
          order.restaurant_amount ||
            0
        ),
      0
    );

  const restaurantMonth =
    liquidation
      ? Number(
          liquidation.restaurant_total ??
            0
        )
      : ordersMonth.reduce(
          (acc, order) =>
            acc +
            Number(
              order.restaurant_amount ||
                0
            ),
          0
        );

  const totalOrders =
    liquidation
      ? Number(
          liquidation.total_orders ??
            0
        )
      : ordersMonth.length;

  const averageTicket =
    totalOrders > 0
      ? salesMonth /
        totalOrders
      : 0;

  return {

    sales: {

      today: salesToday,

      week: salesWeek,

      month: salesMonth,

    },

    wolf: {

      today: wolfToday,

      week: wolfWeek,

      month: wolfMonth,

    },

    restaurant: {

      today:
        restaurantToday,

      week:
        restaurantWeek,

      month:
        restaurantMonth,

    },

    totalOrders,

    averageTicket,

    ordersToday,

    ordersWeek,

    ordersMonth,

  };
}


