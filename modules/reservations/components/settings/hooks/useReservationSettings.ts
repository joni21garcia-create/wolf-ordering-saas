 "use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getReservationSettings,
  updateReservationSettings,
} from "@/modules/reservations/actions";

import type {
  ReservationSettings,
  ReservationSettingsInput,
} from "@/modules/reservations/repositories/settings.repository";

type UseReservationSettingsResult = {
  settings: ReservationSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  updateSetting: (
    input: ReservationSettingsInput,
  ) => Promise<ReservationSettings | null>;
  refresh: () => Promise<void>;
};

export function useReservationSettings(
  restaurantId: string,
): UseReservationSettingsResult {
  const [settings, setSettings] =
    useState<ReservationSettings | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!restaurantId?.trim()) {
      if (mountedRef.current) {
        setSettings(null);
        setError("No se encontró el restaurante.");
        setIsLoading(false);
      }

      return;
    }

    if (mountedRef.current) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const result = await getReservationSettings(restaurantId);

      if (!mountedRef.current) {
        return;
      }

      setSettings(result);
    } catch (cause) {
      if (!mountedRef.current) {
        return;
      }

      setError(getErrorMessage(cause));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [restaurantId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const updateSetting = useCallback(
    async (
      input: ReservationSettingsInput,
    ): Promise<ReservationSettings | null> => {
      if (!restaurantId?.trim()) {
        setError("No se encontró el restaurante.");
        return null;
      }

      setIsSaving(true);
      setError(null);

      try {
        const result = await updateReservationSettings(
          restaurantId,
          input,
        );

        if (!result?.success || !result.data) {
          throw new Error(
            "No fue posible guardar la configuración de reservas.",
          );
        }

        if (mountedRef.current) {
          setSettings(result.data);
        }

        return result.data;
      } catch (cause) {
        if (mountedRef.current) {
          setError(getErrorMessage(cause));
        }

        return null;
      } finally {
        if (mountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [restaurantId],
  );

  return {
    settings,
    isLoading,
    isSaving,
    error,
    updateSetting,
    refresh,
  };
}

function getErrorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message.trim()) {
    return translateSettingsError(cause.message);
  }

  return "No fue posible cargar o guardar la configuración de reservas.";
}

function translateSettingsError(message: string): string {
  switch (message) {
    case "RESTAURANT_ID_REQUIRED":
      return "No se encontró el restaurante.";

    case "INVALID_RESERVATION_DURATION":
      return "La duración de la reserva no es válida.";

    case "INVALID_SLOT_INTERVAL":
      return "El intervalo entre reservas no es válido.";

    case "INVALID_MIN_ADVANCE_HOURS":
      return "La anticipación mínima no es válida.";

    case "INVALID_MAX_ADVANCE_DAYS":
      return "La anticipación máxima no es válida.";

    case "INVALID_ADVANCE_WINDOW":
      return "La ventana de anticipación no es válida.";

    case "INVALID_MIN_GUESTS":
      return "El mínimo de personas no es válido.";

    case "INVALID_MAX_GUESTS":
      return "El máximo de personas no es válido.";

    case "INVALID_GUEST_RANGE":
      return "El rango de personas no es válido.";

    case "INVALID_CANCELLATION_LIMIT":
      return "El límite de cancelación no es válido.";

    case "INVALID_BUFFER_BEFORE":
      return "El margen antes de la reserva no es válido.";

    case "INVALID_BUFFER_AFTER":
      return "El margen después de la reserva no es válido.";

    case "INVALID_TIMEZONE":
      return "La zona horaria no es válida.";

    default:
      return message;
  }
}
