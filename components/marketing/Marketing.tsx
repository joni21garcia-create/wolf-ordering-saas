"use client";

import MarketingHeader from "./MarketingHeader";
import MarketingLayout from "./MarketingLayout";
import MarketingSettings from "./MarketingSettings";
import MarketingPreview from "./MarketingPreview";
import QRActions from "./QRActions";

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

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);

      alert("✅ Enlace copiado correctamente.");
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

  return (
    <>
      <MarketingHeader />

      <MarketingLayout
        settings={
          <>
            <MarketingSettings
              restaurant={restaurant}
              publicUrl={publicUrl}
              config={config}
              setConfig={setConfig}
            />

            <div
              style={{
                marginTop: 24,
              }}
            >
              <QRActions
                onCopy={handleCopy}
                onShare={handleShare}
                onDownloadPNG={handleDownloadPNG}
                onDownloadPDF={handleDownloadPDF}
              />
            </div>
          </>
        }
        preview={
          <MarketingPreview
            restaurant={restaurant}
            publicUrl={publicUrl}
            qrImage={qrImage}
            loading={loading}
            error={error}
            config={config}
          />
        }
      />
    </>
  );
}