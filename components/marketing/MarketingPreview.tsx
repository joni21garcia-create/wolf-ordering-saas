"use client";

import MarketingCard from "./MarketingCard";
import QRPreview from "./QRPreview";
import PosterPreview from "./PosterPreview";

import type {
  MarketingConfig,
  RestaurantData,
} from "@/types/marketing";

interface Props {
  restaurant: RestaurantData;
  publicUrl: string;
  qrImage: string;
  loading: boolean;
  error: string | null;
  config: MarketingConfig;
}

export default function MarketingPreview({
  restaurant,
  publicUrl,
  qrImage,
  loading,
  error,
  config,
}: Props) {
  const logoUrl = config.showLogo
    ? restaurant.logo_url ?? undefined
    : undefined;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <MarketingCard
        title="Vista previa"
        description="Así verán tus clientes el código QR al escanearlo."
      >
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <QRPreview
            restaurantName={restaurant.name}
            qrImage={qrImage}
            url={publicUrl}
            logoUrl={logoUrl}
          />
        )}
      </MarketingCard>

      <MarketingCard
        title="Poster promocional"
        description="Vista previa del póster listo para imprimir."
      >
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <PosterPreview
            restaurantName={restaurant.name}
            qrImage={qrImage}
            url={publicUrl}
            logoUrl={logoUrl}
          />
        )}
      </MarketingCard>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 320,
        color: "#9ca3af",
        fontSize: 15,
        fontWeight: 500,
      }}
    >
      Generando código QR...
    </div>
  );
}

interface ErrorStateProps {
  message: string;
}

function ErrorState({
  message,
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 320,
        color: "#ef4444",
        fontWeight: 600,
        textAlign: "center",
        padding: 24,
      }}
    >
      {message}
    </div>
  );
}