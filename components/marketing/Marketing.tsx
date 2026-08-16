"use client";

import MarketingAccordion from "./MarketingAccordion";
import MarketingSettings from "./MarketingSettings";
import QRActions from "./QRActions";
import QRPreview from "./QRPreview";
import PosterPreview from "./PosterPreview";

import { useMarketing } from "@/hooks/useMarketing";

import { downloadPNG } from "@/lib/qr/downloadQR";
import { downloadPDF } from "@/lib/qr/downloadPDF";

import type { RestaurantData } from "@/types/marketing";

interface Props {
  restaurant: RestaurantData;
}

export default function Marketing({
  restaurant,
}: Props) {
  const {
    publicUrl,
    qrImage,
    loading,
    error,
    config,
    setConfig,
  } = useMarketing(restaurant);

  /*
  =========================================================
  ACCIONES
  =========================================================
  */

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(
        publicUrl
      );

      alert(
        "✅ Enlace copiado correctamente."
      );
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible copiar el enlace."
      );
    }
  }

  function handleShare() {
    const message = encodeURIComponent(
      `🍽️ ${restaurant.name}

Haz tu pedido desde nuestro menú digital.

${publicUrl}

Powered by Wolf Ordering`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleDownloadPNG() {
    if (!qrImage) return;

    downloadPNG(
      qrImage,
      restaurant.name
    );
  }

  async function handleDownloadPDF() {
    if (!qrImage) return;

    await downloadPDF({
      restaurantName: restaurant.name,
      qrImage,
      url: publicUrl,
      logoUrl: config.showLogo
        ? restaurant.logo_url ?? undefined
        : undefined,
    });
  }

  /*
  =========================================================
  LOGO
  =========================================================
  */

  const logoUrl = config.showLogo
    ? restaurant.logo_url ?? undefined
    : undefined;

  /*
  =========================================================
  QR
  =========================================================
  */

  const qrContent = (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          Generando código QR...
        </div>
      ) : error ? (
        <div
          style={{
            width: "100%",
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
            padding: 20,
            boxSizing: "border-box",
          }}
        >
          {error}
        </div>
      ) : qrImage ? (
        <QRPreview
          restaurantName={restaurant.name}
          qrImage={qrImage}
          url={publicUrl}
          logoUrl={logoUrl}
        />
      ) : (
        <div
          style={{
            width: "100%",
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          No hay código QR disponible.
        </div>
      )}
    </>
  );

  /*
  =========================================================
  ACCIONES
  =========================================================
  */

  const actions = (
    <QRActions
      onCopy={handleCopy}
      onShare={handleShare}
      onDownloadPNG={handleDownloadPNG}
      onDownloadPDF={handleDownloadPDF}
    />
  );

  /*
  =========================================================
  CONFIGURACIÓN QR
  =========================================================
  */

  const qrSettings = (
    <MarketingSettings
      restaurant={restaurant}
      publicUrl={publicUrl}
      config={config}
      setConfig={setConfig}
    />
  );

  /*
  =========================================================
  PÓSTER
  =========================================================
  */

  const poster = (
    <>
      {loading ? (
        <div
          style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          Generando póster...
        </div>
      ) : error ? (
        <div
          style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ef4444",
            fontSize: 14,
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : qrImage ? (
        <PosterPreview
          restaurantName={restaurant.name}
          qrImage={qrImage}
          url={publicUrl}
          logoUrl={logoUrl}
        />
      ) : (
        <div
          style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: 14,
          }}
        >
          No hay información suficiente
          para generar el póster.
        </div>
      )}
    </>
  );

  /*
  =========================================================
  UI
  =========================================================
  */

  return (
    <MarketingAccordion
      qrContent={qrContent}
      actions={actions}
      qrSettings={qrSettings}
      poster={poster}
    />
  );
} 