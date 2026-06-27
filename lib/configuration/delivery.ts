export function getDeliveryFee(
  subtotal: number,
  deliveryFee: number,
  freeDeliveryFrom: number
) {
  if (
    freeDeliveryFrom > 0 &&
    subtotal >= freeDeliveryFrom
  ) {
    return 0;
  }

  return deliveryFee;
}

export function canCheckout(
  subtotal: number,
  minimumOrder: number
) {
  return subtotal >= minimumOrder;
}