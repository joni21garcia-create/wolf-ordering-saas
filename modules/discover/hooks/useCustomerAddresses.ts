"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  setDefaultCustomerAddress,
  updateCustomerAddress,
} from "@/modules/discover/services/customerAddresses";

import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  UpdateCustomerAddressInput,
} from "@/modules/discover/types/customerAddress";

interface UseCustomerAddressesReturn {
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  refresh: () => Promise<void>;

  create: (
    input: CreateCustomerAddressInput,
  ) => Promise<CustomerAddress | null>;

  update: (
    addressId: string,
    input: UpdateCustomerAddressInput,
  ) => Promise<CustomerAddress | null>;

  remove: (addressId: string) => Promise<boolean>;

  setDefault: (addressId: string) => Promise<CustomerAddress | null>;

  clearError: () => void;
}

export function useCustomerAddresses(): UseCustomerAddressesReturn {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getCustomerAddresses();
      setAddresses(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudieron cargar tus direcciones.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const create = useCallback(
    async (
      input: CreateCustomerAddressInput,
    ): Promise<CustomerAddress | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const created = await createCustomerAddress(input);

        setAddresses((current) => {
          const next = input.is_default
            ? current.map((address) => ({
                ...address,
                is_default: false,
              }))
            : current;

          return [created, ...next];
        });

        return created;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo guardar la dirección.";

        console.error("[WOLF ADDRESS CREATE]", err);
        setError(message);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      addressId: string,
      input: UpdateCustomerAddressInput,
    ): Promise<CustomerAddress | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const updated = await updateCustomerAddress(addressId, input);

        setAddresses((current) => {
          const next = current.map((address) =>
            address.id === updated.id ? updated : address,
          );

          if (updated.is_default) {
            return next.map((address) => ({
              ...address,
              is_default:
                address.id === updated.id ? true : false,
            }));
          }

          return next;
        });

        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo actualizar la dirección.";

        setError(message);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const remove = useCallback(
    async (addressId: string): Promise<boolean> => {
      setIsSaving(true);
      setError(null);

      try {
        await deleteCustomerAddress(addressId);

        setAddresses((current) =>
          current.filter((address) => address.id !== addressId),
        );

        return true;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo eliminar la dirección.";

        setError(message);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const setDefault = useCallback(
    async (addressId: string): Promise<CustomerAddress | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const updated = await setDefaultCustomerAddress(addressId);

        setAddresses((current) =>
          current.map((address) => ({
            ...address,
            is_default: address.id === updated.id,
          })),
        );

        return updated;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo establecer la dirección predeterminada.";

        setError(message);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const defaultAddress =
    addresses.find((address) => address.is_default) ?? null;

  return {
    addresses,
    defaultAddress,
    isLoading,
    isSaving,
    error,
    refresh: loadAddresses,
    create,
    update,
    remove,
    setDefault,
    clearError,
  };
}