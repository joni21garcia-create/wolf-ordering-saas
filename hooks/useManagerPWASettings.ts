"use client";

import { useCallback, useEffect, useState } from "react";

export interface ManagerPWASettings {
  app_name: string;
  short_name: string;
  description: string;
  app_logo: string;
  theme_color: string;
  background_color: string;
  display: string;
  orientation: string;

  created_at?: string;
  updated_at?: string;
}

const defaults: ManagerPWASettings = {
  app_name: "Wolf Ordering Manager",
  short_name: "Wolf Manager",
  description:
    "Aplicación oficial de Wolf Ordering para la gestión de restaurantes.",
  app_logo: "",
  theme_color: "#f97316",
  background_color: "#111827",
  display: "standalone",
  orientation: "portrait",
};

export function useManagerPWASettings() {

  const [settings, setSettings] =
    useState<ManagerPWASettings>(defaults);

  const [loading, setLoading] =
    useState(true);

    const [saving, setSaving] = useState(false);

  const loadSettings =
    useCallback(async () => {

      const response = await fetch(
        "/api/pwa/get-manager-settings"
      );

      const json = await response.json();

      if (json.success && json.settings) {
        setSettings(json.settings);
      }

      setLoading(false);

    }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

return {
  settings,
  setSettings,
  loading,
  saving,
  setSaving,
};

}