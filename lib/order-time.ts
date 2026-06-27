    export function getEstimatedTime(
  deliverySettings: any
) {
  const preparation =
    Number(
      deliverySettings?.preparation_time
    ) || 0;

  const delivery =
    Number(
      deliverySettings?.delivery_time
    ) || 0;

  return {
    preparation,
    delivery,
    total:
      preparation + delivery,
  };
}