"use client";
import { ManagerPWASettings } from "@/types/pwa";
import { useCallback, useEffect, useState } from "react";

// ... (Interface ManagerPWASettings igual)

const defaults: ManagerPWASettings = {
  app_name: "Wolf Ordering Manager",
  short_name: "Wolf Manager",
  description: "Aplicación oficial de Wolf Ordering para la gestión de restaurantes.",
  app_logo: "",
  theme_color: "#f97316",
  background_color: "#111827",
  display: "standalone",
  orientation: "portrait",
};

export function useManagerPWASettings() {
  const [settings, setSettings] = useState<ManagerPWASettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cleanUrl = (url: any) => {
    if (!url || typeof url !== 'string' || url.trim() === "" || !url.startsWith('http')) return "";
    return url;
  };

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pwa/get-manager-settings");
      
      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const json = await response.json();

      if (json.success && json.settings) {
        const data = json.settings;
        
        // 🛠️ MEJORA: Filtramos solo los valores que no son null/undefined 
        // para no sobreescribir con valores vacíos accidentalmente
        const normalizedData = {
          ...defaults,
          ...data,
          app_logo: cleanUrl(data.app_logo),
          icon_72_url: cleanUrl(data.icon_72_url),
          icon_96_url: cleanUrl(data.icon_96_url),
          icon_128_url: cleanUrl(data.icon_128_url),
          icon_144_url: cleanUrl(data.icon_144_url),
          icon_152_url: cleanUrl(data.icon_152_url),
          icon_192_url: cleanUrl(data.icon_192_url),
          icon_384_url: cleanUrl(data.icon_384_url),
          icon_512_url: cleanUrl(data.icon_512_url),
          maskable_icon_url: cleanUrl(data.maskable_icon_url),
        };

        setSettings(normalizedData);
      }
    } catch (error) {
      console.error("Error cargando configuración PWA:", error);
      setSettings(defaults);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 🛠️ NUEVO: Añadimos una función para refrescar manualmente
  // Esto es vital cuando subes un logo nuevo y quieres ver los iconos actualizados
  const refreshSettings = useCallback(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    setSettings,
    loading,
    saving,
    setSaving,
    refreshSettings, // Exponemos esta función
  };
}