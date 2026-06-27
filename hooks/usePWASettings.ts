"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  RestaurantPWASettings,
} from "@/types/pwa";

import {
  defaultPWASettings,
} from "@/lib/pwa/defaultPWA";

interface ApiResponse {
  success: boolean;
  settings?: RestaurantPWASettings;
  error?: string;
}

export function usePWASettings(
  restaurantId: string
) {
  const [
    settings,
    setSettings,
  ] =
    useState<RestaurantPWASettings>({
      ...defaultPWASettings,
      restaurant_id: restaurantId,
    });

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  const loadSettings =
    useCallback(async () => {
      try {

        setLoading(true);
        setError(null);

        console.log(
          "Cargando configuración PWA..."
        );

        const response =
          await fetch(
            `/api/pwa/get-settings?restaurantId=${restaurantId}`
          );

        const json: ApiResponse =
          await response.json();

        console.log(
          "GET SETTINGS:",
          json
        );

        if (
          json.success &&
          json.settings
        ) {

          setSettings(
            json.settings
          );

          return;
        }

        setSettings({
          ...defaultPWASettings,
          restaurant_id:
            restaurantId,
        });

      } catch (err) {

        console.error(
          "ERROR LOAD SETTINGS",
          err
        );

        setError(
          "No fue posible cargar la configuración."
        );

        setSettings({
          ...defaultPWASettings,
          restaurant_id:
            restaurantId,
        });

      } finally {

        setLoading(false);

      }

    }, [restaurantId]);

  useEffect(() => {

    if (!restaurantId)
      return;

    loadSettings();

  }, [
    restaurantId,
    loadSettings,
  ]);

  function updateField<
    K extends keyof RestaurantPWASettings
  >(
    field: K,
    value: RestaurantPWASettings[K]
  ) {

    setSettings((prev) => ({

      ...prev,

      [field]: value,

    }));

  }

  async function saveSettings(): Promise<void> {

    console.log(
      "=================================="
    );

    console.log(
      "SAVE SETTINGS INICIADO"
    );

    console.log(
      "Restaurant:",
      restaurantId
    );

    console.log(
      "Datos a guardar:",
      settings
    );

    try {

      setSaving(true);

      setError(null);

      const response =
        await fetch(
          "/api/pwa/save-settings",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              settings
            ),

          }
        );

      console.log(
        "HTTP STATUS:",
        response.status
      );

      const json: ApiResponse =
        await response.json();

      console.log(
        "RESPUESTA API:",
        json
      );

      if (
        !json.success
      ) {

        throw new Error(
          json.error ??
            "Error guardando configuración."
        );

      }

      if (
        json.settings
      ) {

        setSettings(
          json.settings
        );

      }

      console.log(
        "CONFIGURACIÓN GUARDADA"
      );

      alert(
  "Configuración del restaurante guardada correctamente."
);

    } catch (err: any) {

      console.error(
        "ERROR SAVE SETTINGS",
        err
      );

      setError(
        err.message ??
          "Error desconocido."
      );

    } finally {

      setSaving(false);

      console.log(
        "SAVE FINALIZADO"
      );

      console.log(
        "=================================="
      );

    }

  }

  return {

    settings,

    loading,

    saving,

    error,

    setSettings,

    updateField,

    loadSettings,

    saveSettings,

  };

}