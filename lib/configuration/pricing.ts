export interface CommissionConfig {
  commission_active: boolean;
  commission_percentage: number;
  commission_type: "customer" | "restaurant";
}

export function getCommissionConfig(
  restaurant: any
): CommissionConfig {
  return {
    commission_active:
      restaurant?.commission_active ?? false,

    commission_percentage:
      Number(
        restaurant?.commission_percentage
      ) || 0,

    commission_type:
      restaurant?.commission_type === "restaurant"
        ? "restaurant"
        : "customer",
  };
}

export function getCommissionAmount(
  basePrice: number,
  config: CommissionConfig
) {
  if (!config.commission_active) return 0;

  return Number(
    (
      basePrice *
      (config.commission_percentage / 100)
    ).toFixed(2)
  );
}

export function getFinalPrice(
  basePrice: number,
  config: CommissionConfig
) {
  if (!config.commission_active) {
    return Number(basePrice.toFixed(2));
  }

  if (config.commission_type === "customer") {
    return Number(
      (
        basePrice +
        getCommissionAmount(
          basePrice,
          config
        )
      ).toFixed(2)
    );
  }

  return Number(basePrice.toFixed(2));
}

export function getRestaurantAmount(
  basePrice: number,
  config: CommissionConfig
) {
  const commission =
    getCommissionAmount(
      basePrice,
      config
    );

  if (
    config.commission_active &&
    config.commission_type === "restaurant"
  ) {
    return Number(
      (
        basePrice - commission
      ).toFixed(2)
    );
  }

  return Number(basePrice.toFixed(2));
}

export function getOrderTotal(
  subtotal: number,
  deliveryFee: number
) {
  return Number(
    (
      subtotal +
      deliveryFee
    ).toFixed(2)
  );
}


