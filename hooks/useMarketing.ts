"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { generateQRCode } from "@/lib/qr/generateQR";

import type {
  MarketingConfig,
  RestaurantData,
} from "@/types/marketing";

interface UseMarketingReturn {
  restaurant: RestaurantData;
  publicUrl: string;
  qrImage: string;
  loading: boolean;
  error: string | null;
  config: MarketingConfig;
  setConfig: React.Dispatch<
    React.SetStateAction<MarketingConfig>
  >;
  regenerateQR: () => Promise<void>;
}

export function useMarketing(
  restaurant: RestaurantData
): UseMarketingReturn {
  /**
   * URL pública del restaurante
   */
  const publicUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/${restaurant.slug}`;
  }, [restaurant.slug]);

  /**
   * Estados
   */
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [qrImage, setQrImage] =
    useState("");

  /**
   * Configuración editable
   */
  const [config, setConfig] =
    useState<MarketingConfig>({
      qrColor:
        restaurant.primary_color ??
        "#f97316",

      qrSize: 1024,

      showLogo: true,

      backgroundColor: "#ffffff",
    });

  /**
   * Generar nuevamente el QR
   */
  const regenerateQR =
    useCallback(async () => {
      if (!publicUrl) return;

      setLoading(true);
      setError(null);

      try {
        const qr =
          await generateQRCode({
            url: publicUrl,
            size: config.qrSize,
            color: config.qrColor,
          });

        setQrImage(qr);
      } catch (err) {
        console.error(err);

        setError(
          "No fue posible generar el código QR."
        );
      } finally {
        setLoading(false);
      }
    }, [
      publicUrl,
      config.qrColor,
      config.qrSize,
    ]);

  /**
   * Regenerar automáticamente
   * cuando cambie la configuración
   */
  useEffect(() => {
    regenerateQR();
  }, [regenerateQR]);

  return {
    restaurant,

    publicUrl,

    qrImage,

    loading,

    error,

    config,

    setConfig,

    regenerateQR,
  };
}