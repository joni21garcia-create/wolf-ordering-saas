"use client";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";

import GeneralSection from "./form/GeneralSection";
import OwnerSection from "./form/OwnerSection";
import LocationSection from "./form/LocationSection";
import BrandingSection from "./form/BrandingSection";
import DeliverySection from "./form/DeliverySection";
import SubmitSection from "./form/SubmitSection";

interface RestaurantFormProps {
  mode: "create" | "edit";

  restaurantId?: string;

  wizardStep?: number;

  form?: RestaurantFormData;

  setForm?: React.Dispatch<
    React.SetStateAction<RestaurantFormData>
  >;

  onNextStep?: () => void;

}

export interface RestaurantFormData {
  name: string;
  slug: string;

  owner_name: string;
  owner_email: string;

  whatsapp: string;
  address: string;

  latitude: string;
  longitude: string;

  description: string;

  logo_url: string;
  banner_url: string;

  favicon_url: string;
  og_image_url: string;

  hero_title: string;
  hero_subtitle: string;
  hero_button_text: string;

  primary_color: string;
  secondary_color: string;

  background_color: string;
  text_color: string;
  button_color: string;

  pickup_enabled: boolean;
  delivery_enabled: boolean;

  active: boolean;
  accepting_orders: boolean;

  delivery_fee: number;
  minimum_order: number;
  free_delivery_from: number;

  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url: string;
  website_url: string;

  meta_title: string;
  meta_description: string;

  plan_name: string;
}

export const INITIAL_FORM: RestaurantFormData = {
  name: "",
  slug: "",

  owner_name: "",
  owner_email: "",

  whatsapp: "",
  address: "",

  latitude: "",
  longitude: "",

  description: "",

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
};

export default function RestaurantForm({
  mode,
  restaurantId,
  wizardStep,
  form: externalForm,
  setForm: externalSetForm,
  onNextStep,
}: RestaurantFormProps) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const {
    upload,
    uploading: imageUploading,
    progress,
  } = useImageUpload();

const [
  internalForm,
  internalSetForm,
] = useState<RestaurantFormData>(
  INITIAL_FORM
);

const form =
  externalForm ??
  internalForm;

const setForm =
  externalSetForm ??
  internalSetForm;

useEffect(() => {
  if (
    mode === "edit" &&
    restaurantId
  ) {
    loadRestaurant();
    return;
  }

  if (
    mode === "create" &&
    externalForm
  ) {
    internalSetForm(
      externalForm
    );
  }
}, [
  mode,
  restaurantId,
  externalForm,
]);

  const loadRestaurant =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from("restaurants")
        .select("*")
        .eq(
          "id",
          restaurantId
        )
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      setForm((prev) => ({
        ...prev,
        ...data,
      }));
    };

  const uploadRestaurantImage =
    async (
      file: File,
      field:
        | "logo_url"
        | "banner_url"
    ) => {
      try {
        setUploading(true);

        const result =
          await upload({
            file,
            restaurantId:
              restaurantId ?? "new",
            preset:
              field === "logo_url"
                ? "logo"
                : "banner",
          });

        if (!result.success) {
          throw new Error(
            result.error
          );
        }

        setForm((prev) => ({
          ...prev,
          [field]:
            result.url!,
        }));

      } catch (error) {
        console.error(error);

        alert(
          "Error subiendo imagen"
        );
      } finally {
        setUploading(false);
      }
    };

  const deleteRestaurant =
    async () => {
      if (
        !restaurantId
      )
        return;

      const confirmDelete =
        confirm(
          "¿Eliminar restaurante?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("restaurants")
          .delete()
          .eq(
            "id",
            restaurantId
          );

      if (error) {
        alert(
          "Error eliminando"
        );
        return;
      }

      router.push(
        "/super-admin/restaurants"
      );
    };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

if (isWizard) {
  onNextStep?.();
  return;
}
    try {
      setLoading(true);


      if (
        mode === "create"
      ) {
        const {
          data,
          error,
        } = await supabase
          .from("restaurants")
          .insert({
            ...form,

            terms_accepted:
              true,

            terms_accepted_at:
              new Date().toISOString(),
          })
          .select()
          .maybeSingle();

        if (error)
          throw error;

        alert(
          "Restaurante creado correctamente"
        );

        router.push(
          "/super-admin/restaurants"
        );
      }

      if (
        mode === "edit" &&
        restaurantId
      ) {
        const {
          error,
        } = await supabase
          .from("restaurants")
          .update(form)
          .eq(
            "id",
            restaurantId
          );

        if (error)
          throw error;

        alert(
          "Restaurante actualizado"
        );

        router.push(
          "/super-admin/restaurants"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Ocurrió un error"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================================
  WIZARD
  =====================================================
  */

  const currentStep =
    wizardStep ?? 1;

  const showGeneral =
    currentStep === 1;

  const showLocation =
    currentStep === 2;

  const showBranding =
    currentStep === 3;

  const showDelivery =
    currentStep === 4;

  const isWizard =
    wizardStep !== undefined;

const sectionProps = {
  form,
  setForm,
  loading,
  uploading,
  imageUploading,
  progress,
};
    return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px",
      }}
    >
      <h1
        style={{
          color: "#fff",
          marginBottom:
            "30px",
        }}
      >
        {mode === "create"
          ? "Nuevo Restaurante"
          : "Editar Restaurante"}
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
          }}
        >

{(!isWizard || showGeneral) && (
  <GeneralSection
    {...sectionProps}
  />
)}

{(!isWizard || showGeneral) && (
  <OwnerSection
    {...sectionProps}
  />
)}

{(!isWizard || showLocation) && (
  <LocationSection
    {...sectionProps}
  />
)}

{(!isWizard || showBranding) && (
  <BrandingSection
    form={form}
    setForm={setForm}
    uploading={uploading}
    imageUploading={imageUploading}
    progress={progress}
    onUpload={uploadRestaurantImage}
  />
)}

{(!isWizard || showDelivery) && (
  <DeliverySection
    {...sectionProps}
  />
)}

        </div>

        {mode === "edit" && (
          <button
            type="button"
            onClick={
              deleteRestaurant
            }
            style={{
              marginTop: "30px",
              marginRight: "15px",
              padding:
                "15px 30px",
              borderRadius:
                "12px",
              background:
                "#dc2626",
              color: "#fff",
              border: "none",
            }}
          >
            Eliminar
          </button>
        )}

        {!isWizard && (
          <SubmitSection
            loading={
              loading || uploading
            }
            mode={mode}
          />
        )}

      </form>
    </main>
  );
}


