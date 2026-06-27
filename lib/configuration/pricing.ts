export function getFinalPrice(
  basePrice: number,
  commissionPercent: number,
  restaurantPaysCommission: boolean
) {
  if (restaurantPaysCommission) {
    return Number(basePrice);
  }

  return Number(
    (
      basePrice *
      (1 + commissionPercent / 100)
    ).toFixed(2)
  );
}

export function getCommissionAmount(
  basePrice: number,
  commissionPercent: number
) {
  return Number(
    (
      basePrice *
      (commissionPercent / 100)
    ).toFixed(2)
  );
}

export function getRestaurantAmount(
  basePrice: number,
  commissionPercent: number,
  restaurantPaysCommission: boolean
) {
  const commission =
    getCommissionAmount(
      basePrice,
      commissionPercent
    );

  if (restaurantPaysCommission) {
    return Number(
      (
        basePrice - commission
      ).toFixed(2)
    );
  }

  return Number(basePrice);
}