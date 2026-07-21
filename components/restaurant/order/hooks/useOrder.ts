import { useEffect } from "react";

import { STORAGE_KEYS } from "../constants";
import {
  CustomerData,
  DeliverySettings,
  OrderType,
} from "../types";

import { useLocalStorage } from "./useLocalStorage";

export function useOrder(
  deliverySettings?: DeliverySettings
) {
  const [orderType, setOrderType] =
    useLocalStorage<OrderType>(
      STORAGE_KEYS.ORDER_TYPE,
      null
    );

  const [customerData, setCustomerData] =
    useLocalStorage<CustomerData>(
      STORAGE_KEYS.CUSTOMER,
      {}
    );

  useEffect(() => {
    if (orderType) return;

    const deliveryEnabled =
      deliverySettings?.delivery_enabled;

    const pickupEnabled =
      deliverySettings?.pickup_enabled;

    if (deliveryEnabled && !pickupEnabled) {
      setOrderType("delivery");
    } else if (!deliveryEnabled && pickupEnabled) {
      setOrderType("pickup");
    }
  }, [
    deliverySettings,
    orderType,
    setOrderType,
  ]);

  return {
    orderType,
    setOrderType,
    customerData,
    setCustomerData,
  };
}


