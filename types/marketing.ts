export interface RestaurantData {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  primary_color?: string | null;
}

export interface MarketingConfig {
  qrColor: string;
  qrSize: number;
  showLogo: boolean;
  backgroundColor: string;
}

export interface QRData {
  image: string;
  publicUrl: string;
}

export interface DownloadOptions {
  png: boolean;
  pdf: boolean;
  svg: boolean;
}

/*
 * Preparado para futuras campañas
 */

export type MarketingTemplate =
  | "classic"
  | "modern"
  | "minimal"
  | "table"
  | "poster";

export interface MarketingState {
  template: MarketingTemplate;
}


