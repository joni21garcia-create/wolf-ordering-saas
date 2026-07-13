export interface DeliverySettings {
  delivery_mode: "fixed" | "manual";
  delivery_fee: number;
  free_delivery_enabled: boolean;
  free_delivery_minimum: number;
}

interface Params {
  settings: DeliverySettings;
  orderTotal: number;
}

export interface DeliveryDisplay {
  label: string;
  amount: number;
  isFree: boolean;
  isManual: boolean;
}

export function getDeliveryDisplay({
  settings,
  orderTotal,
}: Params): DeliveryDisplay {
  const {
    delivery_mode,
    delivery_fee,
    free_delivery_enabled,
    free_delivery_minimum,
  } = settings;

  // Si aplica delivery gratis
  if (
    free_delivery_enabled &&
    orderTotal >= free_delivery_minimum
  ) {
    return {
      label: "Delivery gratis",
      amount: 0,
      isFree: true,
      isManual: false,
    };
  }

  // Delivery manual
  if (delivery_mode === "manual") {
    return {
      label: "Costo acordado con el restaurante",
      amount: 0,
      isFree: false,
      isManual: true,
    };
  }

  // Delivery fijo
  return {
    label: `$ ${Number(delivery_fee).toFixed(2)}`,
    amount: Number(delivery_fee),
    isFree: false,
    isManual: false,
  };
}