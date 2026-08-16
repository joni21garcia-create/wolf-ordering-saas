"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import RestaurantForm from "@/components/super-admin/restaurants/RestaurantForm";


import NewRestaurantProgress from "./NewRestaurantProgress";
import NewRestaurantSidebar from "./NewRestaurantSidebar";
import NewRestaurantFooter from "./NewRestaurantFooter";

import NewRestaurantAgreement from "./NewRestaurantAgreement";
import NewRestaurantAgreementPreview from "./NewRestaurantAgreementPreview";
import NewRestaurantSignature from "./NewRestaurantSignature";
import NewRestaurantSummary from "./NewRestaurantSummary";
import NewRestaurantFinish from "./NewRestaurantFinish";
import { createRestaurant } from "@/lib/restaurants/createRestaurant";

import {
  CURRENT_AGREEMENT_VERSION,
} from "@/lib/restaurants/defaults";

import {
  type RestaurantFormData,
} from "@/components/super-admin/restaurants/RestaurantForm";

type WizardRestaurantData = RestaurantFormData & {
  id: string;
};

const TOTAL_STEPS = 7;

export default function NewRestaurantWizard() {
  /*
  =====================================================
  WIZARD
  =====================================================
  */

  const [step, setStep] =
    useState(1);

  /*
  =====================================================
  AGREEMENT
  =====================================================
  */

  const [
    acceptedTerms,
    setAcceptedTerms,
  ] = useState(false);

  const [
    acceptedPrivacy,
    setAcceptedPrivacy,
  ] = useState(false);

  const [
    acceptedCommission,
    setAcceptedCommission,
  ] = useState(false);

  /*
  =====================================================
  SIGNATURE
  =====================================================
  */

  const [
    signerName,
    setSignerName,
  ] = useState("");

  const [
    signed,
    setSigned,
  ] = useState(false);


/*
====================================================
FINISH
====================================================
*/

const [saving, setSaving] =
  useState(false);

const [finished, setFinished] =
  useState(false);

/*
====================================================
RESTAURANT DATA
====================================================
*/

const [
  restaurantData,
  setRestaurantData,
] = useState<WizardRestaurantData>({
  id: "",

  name: "",

  slug: "",

  description: "",

  owner_name: "",

  owner_email: "",

  whatsapp: "",

  address: "",

  latitude: "",

  longitude: "",

  logo_url: "",

  banner_url: "",

  favicon_url: "",

  og_image_url: "",

  hero_title: "",

  hero_subtitle: "",

  hero_button_text: "Ordenar Ahora",

  primary_color: "#f97316",

  secondary_color: "#111827",

  background_color: "#000000",

  text_color: "#ffffff",

  button_color: "#f97316",

  pickup_enabled: true,

  delivery_enabled: true,

  active: true,

  accepting_orders: true,

  delivery_fee: 0,

  minimum_order: 0,

  free_delivery_from: 0,

  facebook_url: "",

  instagram_url: "",

  tiktok_url: "",

  youtube_url: "",

  website_url: "",

  meta_title: "",

  meta_description: "",

  plan_name: "FREE",
});

useEffect(() => {
  try {
    const saved = localStorage.getItem(
      "wolf-new-restaurant-draft"
    );

    if (!saved) return;

    const draft = JSON.parse(saved);

    if (draft.restaurantData) {
      setRestaurantData(draft.restaurantData);
    }

    setAcceptedTerms(
      draft.acceptedTerms ?? false
    );

    setAcceptedPrivacy(
      draft.acceptedPrivacy ?? false
    );

    setAcceptedCommission(
      draft.acceptedCommission ?? false
    );

    setSignerName(
      draft.signerName ?? ""
    );

    setSigned(
      draft.signed ?? false
    );

    setStep(
      draft.step ?? 1
    );
  } catch (error) {
    console.error(error);
  }
}, []);

 
  /*
  =====================================================
  STEP TITLE
  =====================================================
  */

  const stepTitle =
    useMemo(() => {
      switch (step) {
        case 1:
          return "Información General";

        case 2:
          return "Ubicación";

        case 3:
          return "Branding";

        case 4:
          return "Plan Comercial";

        case 5:
          return "Agreement";

        case 6:
          return "Firma";

        default:
          return "Finalizar";
      }
    }, [step]);

  /*
  =====================================================
  NAVIGATION
  =====================================================
  */

  function nextStep() {
    setStep((old) =>
      Math.min(
        old + 1,
        TOTAL_STEPS
      )
    );
  }

async function handleFinish() {
  try {
    setSaving(true);

    const {
  data: { session },
} = await supabase.auth.getSession();

if (!session?.access_token) {
  throw new Error(
    "No se encontró una sesión válida."
  );
}

    if (finished) {
      return;
    }

const {
  id,
  ...restaurantToInsert
} = restaurantData;

const result =
  await createRestaurant({
    restaurant: {
      ...restaurantToInsert,

      terms_accepted: true,

      terms_accepted_at:
        new Date().toISOString(),
    },

    user: {},

    token:
      session.access_token,
  });

const restaurant =
  result.restaurant;

if (!restaurant?.id) {
  throw new Error(
    "La API no devolvió el restaurante creado."
  );
}

    if (!restaurant?.id) {
      throw new Error(
        "No se pudo recuperar el restaurante creado."
      );
    }

    setRestaurantData((prev) => ({
      ...prev,
      id: restaurant.id,
    }));

localStorage.removeItem(
  "wolf-new-restaurant-draft"
);

    setFinished(true);

  } catch (error) {
    console.error(error);

    alert(
      "Ocurrió un error al crear el restaurante."
    );

  } finally {
    setSaving(false);
  }
}

  function previousStep() {
    setStep((old) =>
      Math.max(old - 1, 1)
    );
  }

  function handleSaveDraft() {
  try {
    localStorage.setItem(
      "wolf-new-restaurant-draft",
      JSON.stringify({
        restaurantData,
        acceptedTerms,
        acceptedPrivacy,
        acceptedCommission,
        signerName,
        signed,
        step,
      })
    );

    alert("Borrador guardado correctamente.");
  } catch (error) {
    console.error(error);

    alert("No fue posible guardar el borrador.");
  }
}

return (
  <>
    {finished ? (
<NewRestaurantFinish
  restaurantId={restaurantData.id}
  restaurantName={restaurantData.name}
  slug={restaurantData.slug}
/>
    ) : (
      <>
        <NewRestaurantProgress
          currentStep={step}
        />

        <div className="wizard-shell">
          <section className="wizard-card">
            <div className="wizard-header">
              <div className="wizard-step-label">
                Paso {step} de {TOTAL_STEPS}
              </div>

              <h2>{stepTitle}</h2>

              <p>
                Completa este paso para continuar con la creación
                del restaurante.
              </p>
            </div>

{step <= 4 && (
<RestaurantForm
  mode="create"
  wizardStep={step}
  form={restaurantData}
  setForm={(value) => {
    setRestaurantData((prev) => ({
      ...prev,
      ...(typeof value === "function"
        ? value(prev)
        : value),
      id: prev.id,
    }));
  }}
  onNextStep={nextStep}
/>
)}

            {step === 5 && (
              <div
                style={{
                  display: "grid",
                  gap: 30,
                }}
              >
                <NewRestaurantAgreement
                  version={
                    CURRENT_AGREEMENT_VERSION
                  }
                  acceptedTerms={
                    acceptedTerms
                  }
                  acceptedPrivacy={
                    acceptedPrivacy
                  }
                  acceptedCommission={
                    acceptedCommission
                  }
                  onAcceptedTerms={
                    setAcceptedTerms
                  }
                  onAcceptedPrivacy={
                    setAcceptedPrivacy
                  }
                  onAcceptedCommission={
                    setAcceptedCommission
                  }
                />

                <NewRestaurantAgreementPreview
                  version={
                    CURRENT_AGREEMENT_VERSION
                  }
                />
              </div>
            )}

            {step === 6 && (
<NewRestaurantSignature
  signerName={signerName}
  signerEmail={restaurantData.owner_email}
  signed={signed}
  onSignerChange={(value) => {
    setSignerName(value);

    setRestaurantData((prev) => ({
      ...prev,
      owner_name: value,
    }));
  }}
  onSignedChange={setSigned}
/>
            )}

{step === 7 && (
  <NewRestaurantSummary
    restaurantName={
      restaurantData.name
    }
    slug={
      restaurantData.slug
    }
    owner={
      restaurantData.owner_name
    }
    email={
      restaurantData.owner_email
    }
    plan={
      restaurantData.plan_name
    }
    agreementAccepted={
      acceptedTerms &&
      acceptedPrivacy &&
      acceptedCommission
    }
  />
)}

<NewRestaurantFooter
  currentStep={step}
  totalSteps={TOTAL_STEPS}
  onPrevious={previousStep}
  onNext={nextStep}
  onFinish={handleFinish}
  onSaveDraft={handleSaveDraft}
  saving={saving}
/>
          </section>

          <NewRestaurantSidebar
            currentStep={step}
            totalSteps={
              TOTAL_STEPS
            }
            restaurantName={
              restaurantData.name
            }
            slug={
              restaurantData.slug
            }
            owner={
              restaurantData.owner_name
            }
            email={
              restaurantData.owner_email
            }
            plan={
              restaurantData.plan_name
            }
            agreementAccepted={
              acceptedTerms &&
              acceptedPrivacy &&
              acceptedCommission
            }
          />
        </div>

        <style jsx>{`
          .wizard-shell {
            width: 100%;
            max-width: 1440px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 24px;
            align-items: start;
            box-sizing: border-box;
            padding: 0 20px 24px;
          }

          .wizard-card {
            min-width: 0;
            box-sizing: border-box;
            min-height: 720px;
            padding: 32px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            background: linear-gradient(180deg, #171717, #101010);
          }

          .wizard-header {
            margin-bottom: 26px;
          }

          .wizard-step-label {
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            margin-bottom: 9px;
            padding: 0 9px;
            border: 1px solid rgba(249, 115, 22, 0.14);
            border-radius: 999px;
            background: rgba(249, 115, 22, 0.06);
            color: #f97316;
            font-size: 10px;
            line-height: 1;
            font-weight: 800;
            letter-spacing: 0.01em;
          }

          .wizard-header h2 {
            margin: 0;
            color: #fff;
            font-size: clamp(25px, 3vw, 34px);
            line-height: 1.05;
            font-weight: 900;
            letter-spacing: -0.04em;
          }

          .wizard-header p {
            max-width: 680px;
            margin: 10px 0 0;
            color: #8b8b8b;
            font-size: 13px;
            line-height: 1.55;
          }

          @media (max-width: 1100px) {
            .wizard-shell {
              grid-template-columns: minmax(0, 1fr) 300px;
              gap: 16px;
              padding-inline: 14px;
            }

            .wizard-card {
              padding: 24px;
            }
          }

          @media (max-width: 820px) {
            .wizard-shell {
              grid-template-columns: 1fr;
              gap: 8px;
              width: 100%;
              max-width: none;
              padding: 0 calc(8px + env(safe-area-inset-left))
                calc(14px + env(safe-area-inset-bottom))
                calc(8px + env(safe-area-inset-right));
            }

            .wizard-card {
              width: 100%;
              min-height: auto;
              padding: 14px;
              border-radius: 16px;
            }

            .wizard-header {
              margin-bottom: 18px;
            }

            .wizard-header h2 {
              font-size: clamp(23px, 7vw, 29px);
            }

            .wizard-header p {
              margin-top: 7px;
              font-size: 11px;
              line-height: 1.45;
            }
          }

          @media (max-width: 520px) {
            .wizard-shell {
              width: 100%;
              padding-left: 4px;
              padding-right: 4px;
            }

            .wizard-card {
              width: 100%;
              padding: 10px;
              border-radius: 12px;
              border-color: rgba(255, 255, 255, 0.06);
            }

            .wizard-header {
              margin-bottom: 12px;
            }

            .wizard-step-label {
              min-height: 22px;
              margin-bottom: 7px;
              padding: 0 8px;
              font-size: 8px;
            }

            .wizard-header h2 {
              font-size: 23px;
              letter-spacing: -0.035em;
            }

            .wizard-header p {
              font-size: 10px;
            }
          }

          @media (max-width: 360px) {
            .wizard-shell {
              padding-left: 2px;
              padding-right: 2px;
            }

            .wizard-card {
              padding: 8px;
            }

            .wizard-header h2 {
              font-size: 21px;
            }
          }
        `}</style>
      </>
    )}
  </>
);
}