import {
  CURRENT_AGREEMENT_VERSION,
  DEFAULT_MODULES,
  DEFAULT_THEME,
} from "./defaults";

export interface RestaurantWizardData {
  /*
  ==========================================
  INFORMACIÓN
  ==========================================
  */

  name: string;

  slug: string;

  description: string;

  owner_name: string;

  owner_email: string;

  owner_phone: string;

  /*
  ==========================================
  UBICACIÓN
  ==========================================
  */

  address: string;

  city: string;

  province: string;

  country: string;

  latitude?: number;

  longitude?: number;

  /*
  ==========================================
  BRANDING
  ==========================================
  */

  logo_url?: string;

  banner_url?: string;

  primary_color?: string;

  secondary_color?: string;

  /*
  ==========================================
  PLAN
  ==========================================
  */

  plan: string;

  commission_percentage?: number;

  /*
  ==========================================
  AGREEMENT
  ==========================================
  */

  agreementAccepted: boolean;

  signatureName: string;
}

export function buildRestaurantWizard(
  data: RestaurantWizardData
) {
  return {
    /*
    ======================================
    RESTAURANT
    ======================================
    */

    restaurant: {
      name: data.name,

      slug: data.slug,

      description: data.description,

      logo_url: data.logo_url,

      banner_url: data.banner_url,

      primary_color:
        data.primary_color ??
        DEFAULT_THEME.primary,

      secondary_color:
        data.secondary_color ??
        DEFAULT_THEME.secondary,

      address: data.address,

      city: data.city,

      province: data.province,

      country: data.country,

      latitude: data.latitude,

      longitude: data.longitude,

      plan: data.plan,

      commission_percentage:
        data.commission_percentage,
    },

    /*
    ======================================
    OWNER
    ======================================
    */

    owner: {
      name: data.owner_name,

      email: data.owner_email,

      phone: data.owner_phone,
    },

    /*
    ======================================
    MODULES
    ======================================
    */

    modules: {
      ...DEFAULT_MODULES,
    },

    /*
    ======================================
    AGREEMENT
    ======================================
    */

    agreement: {
      version:
        CURRENT_AGREEMENT_VERSION,

      accepted:
        data.agreementAccepted,

      accepted_at:
        data.agreementAccepted
          ? new Date().toISOString()
          : null,

      signature_name:
        data.signatureName,
    },
  };
}