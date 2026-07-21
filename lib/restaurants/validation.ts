/*
======================================================
RESTAURANT WIZARD VALIDATION
======================================================
*/

import {
  CURRENT_AGREEMENT_VERSION,
  RESTAURANT_PLANS,
} from "./defaults";

import type {
  RestaurantWizardData,
} from "./buildRestaurantWizard";

export interface ValidationError {
  field: string;

  message: string;
}

export function validateRestaurantWizard(
  data: RestaurantWizardData
): ValidationError[] {
  const errors: ValidationError[] = [];

  /*
  ==========================================
  INFORMACIÓN
  ==========================================
  */

  if (!data.name.trim()) {
    errors.push({
      field: "name",
      message:
        "El nombre del restaurante es obligatorio.",
    });
  }

  if (!data.slug.trim()) {
    errors.push({
      field: "slug",
      message:
        "El slug es obligatorio.",
    });
  }

  if (
    !/^[a-z0-9-]+$/.test(
      data.slug
    )
  ) {
    errors.push({
      field: "slug",
      message:
        "El slug solamente puede contener letras minúsculas, números y guiones.",
    });
  }

  if (!data.owner_name.trim()) {
    errors.push({
      field: "owner_name",
      message:
        "Debe indicar el propietario.",
    });
  }

  if (
    !/\S+@\S+\.\S+/.test(
      data.owner_email
    )
  ) {
    errors.push({
      field: "owner_email",
      message:
        "Correo electrónico inválido.",
    });
  }

  /*
  ==========================================
  PLAN
  ==========================================
  */

  if (
    !RESTAURANT_PLANS.includes(
      data.plan as never
    )
  ) {
    errors.push({
      field: "plan",
      message:
        "Plan no válido.",
    });
  }

  /*
  ==========================================
  AGREEMENT
  ==========================================
  */

  if (
    !data.agreementAccepted
  ) {
    errors.push({
      field:
        "agreementAccepted",

      message:
        "Debe aceptar el Agreement.",
    });
  }

  if (
    !data.signatureName.trim()
  ) {
    errors.push({
      field:
        "signatureName",

      message:
        "Debe firmar el Agreement.",
    });
  }

  return errors;
}

/*
======================================================
ESTADO DEL WIZARD
======================================================
*/

export function canContinueStep(
  step: number,
  data: RestaurantWizardData
) {
  switch (step) {
    case 1:
      return (
        !!data.name &&
        !!data.slug &&
        !!data.owner_name &&
        !!data.owner_email
      );

    case 2:
      return (
        !!data.address &&
        !!data.city
      );

    case 3:
      return true;

    case 4:
      return !!data.plan;

    case 5:
      return (
        data.agreementAccepted
      );

    case 6:
      return (
        !!data.signatureName
      );

    default:
      return true;
  }
}

/*
======================================================
VERSIÓN ACTUAL
======================================================
*/

export function getAgreementVersion() {
  return CURRENT_AGREEMENT_VERSION;
}


