import { useEffect } from "react";

import { STORAGE_KEYS } from "../constants";
import {
  CustomerData,
  DeliverySettings,
  OrderType,
} from "../types";

import { supabase } from "@/lib/supabase/client";
import { useLocalStorage } from "./useLocalStorage";

interface CustomerAddressRow {
  id: string;
  customer_id: string;
  label: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  email: string | null;
  address: string | null;
  zone: string | null;
  reference: string | null;
  instructions: string | null;
  is_default: boolean | null;
}

interface CheckoutCustomerData extends CustomerData {
  email?: string;
  zone?: string;
  reference?: string;
  instructions?: string;
}

function getWolfCustomerId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const customerId =
    window.localStorage.getItem("wolf_customer_id");

  if (customerId?.trim()) {
    return customerId.trim();
  }

  const storedCustomer =
    window.localStorage.getItem("wolf_customer");

  if (!storedCustomer) {
    return null;
  }

  try {
    const customer = JSON.parse(storedCustomer) as {
      id?: unknown;
    };

    if (
      typeof customer.id === "string" &&
      customer.id.trim()
    ) {
      return customer.id.trim();
    }
  } catch {
    // Perfil legacy inválido: simplemente usamos wolf_customer_id.
  }

  return null;
}

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

  useEffect(() => {
    let cancelled = false;

    const loadDefaultCustomerAddress = async () => {
      const customerId = getWolfCustomerId();

      console.log(
        "[WOLF CHECKOUT] customer_id:",
        customerId
      );

      if (!customerId) {
        console.log(
          "[WOLF CHECKOUT] No existe wolf_customer_id"
        );
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("customer_addresses")
        .select(`
          id,
          customer_id,
          label,
          recipient_name,
          recipient_phone,
          email,
          address,
          zone,
          reference,
          instructions,
          is_default
        `)
        .eq("customer_id", customerId)
        .eq("is_default", true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "[WOLF CHECKOUT] Error cargando dirección principal:",
          error
        );
        return;
      }

      console.log(
        "[WOLF CHECKOUT] Dirección principal:",
        data
      );

      if (!data || cancelled) {
        return;
      }

      const address =
        data as CustomerAddressRow;

      setCustomerData((current) => {
        const currentData =
          current as CheckoutCustomerData;

        const nextData: CheckoutCustomerData = {
          ...currentData,
          name:
            address.recipient_name ??
            currentData.name ??
            "",
          phone:
            address.recipient_phone ??
            currentData.phone ??
            "",
          email:
            address.email ??
            currentData.email ??
            "",
          address:
            address.address ??
            currentData.address ??
            "",
          zone:
            address.zone ??
            currentData.zone ??
            "",
          reference:
            address.reference ??
            currentData.reference ??
            "",
          instructions:
            address.instructions ??
            currentData.instructions ??
            "",
        };

        console.log(
          "[WOLF CHECKOUT] customerData rellenado:",
          nextData
        );

        return nextData as CustomerData;
      });
    };

    void loadDefaultCustomerAddress();

    return () => {
      cancelled = true;
    };
  }, [setCustomerData]);

  return {
    orderType,
    setOrderType,
    customerData,
    setCustomerData,
  };
}