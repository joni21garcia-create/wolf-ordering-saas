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
import { createLegalAcceptance } from "@/lib/restaurants/createLegalAcceptance";
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

    await createLegalAcceptance({
  restaurantId: restaurant.id,

  ownerName:
    restaurantData.owner_name,

  ownerEmail:
    restaurantData.owner_email,

  ownerPhone:
    restaurantData.whatsapp,
});

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

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0,1fr) 360px",
            gap: 32,
            alignItems: "start",
          }}
        >
          <section
            style={{
              background:
                "linear-gradient(180deg,#171717,#101010)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius: 32,
              padding: 36,
              minHeight: 760,
            }}
          >
            <div
              style={{
                marginBottom: 30,
              }}
            >
              <div
                style={{
                  color: "#f97316",
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                Paso {step} de {TOTAL_STEPS}
              </div>

              <h2
                style={{
                  margin: 0,
                  color: "#fff",
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                {stepTitle}
              </h2>

              <p
                style={{
                  marginTop: 14,
                  color: "#8b8b8b",
                  lineHeight: 1.8,
                }}
              >
                Completa este paso para continuar con la
                creación del restaurante.
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
      </>
    )}
  </>
);
}