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
import WolfMobileAccordion from "./form/WolfMobileAccordion";

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

  type EditSection =
    | "general"
    | "owner"
    | "location"
    | "branding"
    | "delivery";

  const [activeEditSection, setActiveEditSection] =
    useState<EditSection>("general");

  const [mobileShellOpen, setMobileShellOpen] =
    useState(false);

  useEffect(() => {
    if (!mobileShellOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileShellOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileShellOpen]);

  const editSections: Array<{
    id: EditSection;
    index: string;
    title: string;
    description: string;
    icon: string;
  }> = [
    { id: "general", index: "01", title: "Información General", description: "Identidad del restaurante", icon: "⌁" },
    { id: "owner", index: "02", title: "Propietario", description: "Responsable del negocio", icon: "♙" },
    { id: "location", index: "03", title: "Ubicación", description: "Dirección y coordenadas", icon: "⌖" },
    { id: "branding", index: "04", title: "Branding", description: "Logo, banner y presencia", icon: "◈" },
    { id: "delivery", index: "05", title: "Delivery", description: "Entrega y pedidos", icon: "↗" },
  ];

  const activeSection = editSections.find(
    (section) => section.id === activeEditSection
  ) ?? editSections[0];

const sectionProps = {
  form,
  setForm,
  loading,
  uploading,
  imageUploading,
  progress,
};
    if (!isWizard && mode === "edit") {
      return (
        <main className="edit-shell-page">
          <div
            className={`shell-overlay ${mobileShellOpen ? "is-open" : ""}`}
            onClick={() => setMobileShellOpen(false)}
            aria-hidden="true"
          />

          <aside className={`edit-shell-sidebar ${mobileShellOpen ? "is-open" : ""}`}>
            <div className="sidebar-head">
              <div>
                <span className="sidebar-kicker">WOLF SHELL</span>
                <strong>Configuración</strong>
                <span>Editando restaurante</span>
              </div>
              <button
                type="button"
                className="mobile-close"
                onClick={() => setMobileShellOpen(false)}
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>

            <nav className="section-nav" aria-label="Secciones del restaurante">
              {editSections.map((section) => {
                const selected = section.id === activeEditSection;
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`section-nav-item ${selected ? "is-active" : ""}`}
                    onClick={() => {
                      setActiveEditSection(section.id);
                      setMobileShellOpen(false);
                    }}
                  >
                    <span className="nav-icon">{section.icon}</span>
                    <span className="nav-copy">
                      <span className="nav-index">{section.index}</span>
                      <strong>{section.title}</strong>
                      <small>{section.description}</small>
                    </span>
                    <span className="nav-arrow">›</span>
                  </button>
                );
              })}
            </nav>

            <div className="sidebar-summary">
              <span className="summary-dot" />
              <div>
                <strong>Edición en curso</strong>
                <span>Los cambios se mantienen mientras navegas.</span>
              </div>
            </div>
          </aside>

          <section className="edit-shell-main">
            <header className="edit-shell-header">
              <button
                type="button"
                className="mobile-menu-button"
                onClick={() => setMobileShellOpen(true)}
              >
                <span>☰</span>
                Secciones
              </button>

              <div className="header-copy">
                <span className="header-kicker">EDITAR RESTAURANTE</span>
                <h1>{activeSection.title}</h1>
                <p>{activeSection.description}</p>
              </div>

              <div className="header-index">
                <span>{activeSection.index}</span>
                <small>de {editSections.length}</small>
              </div>
            </header>

            <div className="section-progress">
              <span style={{ width: `${((editSections.findIndex((s) => s.id === activeEditSection) + 1) / editSections.length) * 100}%` }} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="edit-content-card">
                <div className="active-section-heading">
                  <span className="active-number">{activeSection.index}</span>
                  <div>
                    <h2>{activeSection.title}</h2>
                    <p>{activeSection.description}</p>
                  </div>
                </div>

                <div className="section-content">
                  {activeEditSection === "general" && (
                    <GeneralSection
  {...sectionProps}
  embedded
/>
                  )}
                  {activeEditSection === "owner" && (
                   <OwnerSection
  {...sectionProps}
  embedded
/>
                  )}
                  {activeEditSection === "location" && (
                    <LocationSection {...sectionProps} />
                  )}
                  {activeEditSection === "branding" && (
                    <BrandingSection
                      form={form}
                      setForm={setForm}
                      uploading={uploading}
                      imageUploading={imageUploading}
                      progress={progress}
                      onUpload={uploadRestaurantImage}
                    />
                  )}
                  {activeEditSection === "delivery" && (
                    <DeliverySection {...sectionProps} />
                  )}
                </div>
              </div>

              <div className="edit-navigation">
                <button
                  type="button"
                  className="secondary-action"
                  disabled={activeEditSection === "general"}
                  onClick={() => {
                    const index = editSections.findIndex((s) => s.id === activeEditSection);
                    if (index > 0) setActiveEditSection(editSections[index - 1].id);
                  }}
                >
                  ← Anterior
                </button>

                <div className="edit-navigation-center">
                  {editSections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      className={section.id === activeEditSection ? "progress-dot active" : "progress-dot"}
                      onClick={() => setActiveEditSection(section.id)}
                      aria-label={`Ir a ${section.title}`}
                    />
                  ))}
                </div>

                <button
                  type={activeEditSection === "delivery" ? "submit" : "button"}
                  className="primary-action"
                  onClick={() => {
                    if (activeEditSection !== "delivery") {
                      const index = editSections.findIndex((s) => s.id === activeEditSection);
                      if (index < editSections.length - 1) setActiveEditSection(editSections[index + 1].id);
                    }
                  }}
                >
                  {activeEditSection === "delivery" ? "Guardar cambios →" : "Siguiente →"}
                </button>
              </div>

              <div className="danger-zone">
                <div>
                  <span className="danger-kicker">ZONA DE PELIGRO</span>
                  <strong>Eliminar restaurante</strong>
                  <small>Esta acción no se puede deshacer.</small>
                </div>
                <button type="button" onClick={deleteRestaurant}>Eliminar</button>
              </div>
            </form>
          </section>

          <style jsx>{`
            .edit-shell-page {
              min-height: 100dvh;
              width: 100%;
              max-width: 1280px;
              margin: 0 auto;
              display: grid;
              grid-template-columns: 250px minmax(0, 1fr);
              gap: 18px;
              padding: 18px;
              box-sizing: border-box;
              color: #fff;
            }

            .edit-shell-sidebar {
              position: sticky;
              top: 18px;
              align-self: start;
              min-height: calc(100dvh - 36px);
              display: flex;
              flex-direction: column;
              padding: 16px;
              box-sizing: border-box;
              border: 1px solid rgba(255,255,255,.07);
              border-radius: 22px;
              background: linear-gradient(180deg, rgba(20,20,20,.96), rgba(10,10,10,.96));
              box-shadow: 0 18px 50px rgba(0,0,0,.35);
            }

            .sidebar-head {
              display: flex;
              justify-content: space-between;
              gap: 10px;
              padding: 8px 8px 18px;
              border-bottom: 1px solid rgba(255,255,255,.06);
            }

            .sidebar-head > div {
              display: grid;
              gap: 3px;
            }

            .sidebar-kicker, .header-kicker, .danger-kicker {
              color: #f97316;
              font-size: 9px;
              font-weight: 900;
              letter-spacing: 1.3px;
            }

            .sidebar-head strong { font-size: 16px; }
            .sidebar-head span:last-child { color: #71717a; font-size: 10px; }

            .mobile-close, .mobile-menu-button { display: none; }

            .section-nav {
              display: grid;
              gap: 6px;
              margin-top: 14px;
            }

            .section-nav-item {
              width: 100%;
              display: grid;
              grid-template-columns: 34px minmax(0,1fr) 16px;
              align-items: center;
              gap: 9px;
              padding: 10px 9px;
              border: 1px solid transparent;
              border-radius: 14px;
              background: transparent;
              color: #fff;
              text-align: left;
              cursor: pointer;
            }

            .section-nav-item:hover { background: rgba(255,255,255,.035); }
            .section-nav-item.is-active {
              border-color: rgba(249,115,22,.24);
              background: rgba(249,115,22,.08);
            }

            .nav-icon {
              width: 34px; height: 34px; display:grid; place-items:center;
              border-radius: 10px; background: #191919; color:#f97316; font-weight:900;
            }

            .nav-copy { min-width:0; display:grid; gap:2px; }
            .nav-index { color:#f97316; font-size:8px; font-weight:900; }
            .nav-copy strong { font-size:11px; line-height:1.2; }
            .nav-copy small { overflow:hidden; color:#71717a; font-size:8px; white-space:nowrap; text-overflow:ellipsis; }
            .nav-arrow { color:#52525b; font-size:18px; }
            .section-nav-item.is-active .nav-arrow { color:#f97316; }

            .sidebar-summary {
              margin-top: auto;
              display:flex; gap:9px; align-items:flex-start;
              padding:11px; border:1px solid rgba(255,255,255,.06); border-radius:13px; background:rgba(255,255,255,.025);
            }
            .summary-dot { width:7px; height:7px; margin-top:4px; border-radius:50%; background:#f97316; box-shadow:0 0 12px rgba(249,115,22,.7); }
            .sidebar-summary div { display:grid; gap:3px; }
            .sidebar-summary strong { font-size:9px; }
            .sidebar-summary span:last-child { color:#71717a; font-size:8px; line-height:1.4; }

            .edit-shell-main { min-width:0; padding: 10px 6px 30px; }

            .edit-shell-header {
              display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:end; gap:20px;
              padding: 12px 8px 14px;
            }
            .header-copy { display:grid; gap:4px; }
            .header-copy h1 { margin:0; font-size:clamp(1.65rem,4vw,2.6rem); line-height:1; letter-spacing:-.045em; }
            .header-copy p { margin:0; color:#71717a; font-size:11px; }
            .header-index { display:flex; align-items:baseline; gap:4px; color:#f97316; font-weight:900; }
            .header-index span { font-size:20px; }
            .header-index small { color:#71717a; font-size:9px; }

            .section-progress { height:3px; margin:0 8px 14px; overflow:hidden; border-radius:999px; background:#202020; }
            .section-progress span { display:block; height:100%; border-radius:inherit; background:#f97316; transition:width .2s ease; }

            .edit-content-card {
              min-width:0; overflow:hidden; padding:20px; border:1px solid rgba(255,255,255,.07); border-radius:20px; background:#111;
            }

            .active-section-heading { display:flex; gap:12px; align-items:flex-start; margin-bottom:20px; }
            .active-number { width:34px; height:34px; flex:0 0 auto; display:grid; place-items:center; border:1px solid rgba(249,115,22,.25); border-radius:10px; background:rgba(249,115,22,.08); color:#f97316; font-size:10px; font-weight:900; }
            .active-section-heading h2 { margin:0; font-size:20px; line-height:1.1; }
            .active-section-heading p { margin:4px 0 0; color:#71717a; font-size:10px; }
            .section-content { min-width:0; }

            .edit-navigation { display:grid; grid-template-columns:auto 1fr auto; align-items:center; gap:12px; margin-top:12px; }
            .secondary-action, .primary-action { min-height:44px; border-radius:12px; padding:0 17px; font-size:11px; font-weight:900; cursor:pointer; }
            .secondary-action { border:1px solid rgba(255,255,255,.07); background:#151515; color:#71717a; }
            .secondary-action:disabled { opacity:.35; cursor:not-allowed; }
            .primary-action { border:0; background:#f97316; color:#fff; box-shadow:0 8px 22px rgba(249,115,22,.18); }
            .edit-navigation-center { display:flex; justify-content:center; gap:5px; }
            .progress-dot { width:7px; height:7px; padding:0; border:0; border-radius:50%; background:#353535; cursor:pointer; }
            .progress-dot.active { width:20px; border-radius:999px; background:#f97316; }

            .danger-zone { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-top:14px; padding:12px 14px; border:1px solid rgba(220,38,38,.16); border-radius:14px; background:rgba(127,29,29,.06); }
            .danger-zone div { display:grid; gap:3px; }
            .danger-zone strong { font-size:10px; }
            .danger-zone small { color:#71717a; font-size:8px; }
            .danger-zone button { min-height:34px; padding:0 12px; border:1px solid rgba(220,38,38,.25); border-radius:9px; background:transparent; color:#f87171; font-size:9px; font-weight:900; cursor:pointer; }

            @media (max-width: 760px) {
              .edit-shell-page { display:block; padding:0 10px 24px; }
              .edit-shell-sidebar {
                position:fixed; z-index:60; top:0; left:0; width:min(310px,88vw); height:100dvh; min-height:100dvh; border-radius:0 22px 22px 0; transform:translateX(-105%); transition:transform .22s ease; box-shadow:18px 0 60px rgba(0,0,0,.5);
              }
              .edit-shell-sidebar.is-open { transform:translateX(0); }
              .shell-overlay { position:fixed; inset:0; z-index:50; background:rgba(0,0,0,.55); opacity:0; pointer-events:none; transition:opacity .2s ease; backdrop-filter:blur(3px); }
              .shell-overlay.is-open { opacity:1; pointer-events:auto; }
              .mobile-close { display:grid; place-items:center; width:32px; height:32px; border:1px solid rgba(255,255,255,.07); border-radius:10px; background:#181818; color:#f97316; font-size:20px; cursor:pointer; }
              .edit-shell-main { padding:8px 0 20px; }
              .mobile-menu-button { display:inline-flex; align-items:center; gap:7px; margin:0 0 10px 4px; padding:8px 10px; border:1px solid rgba(255,255,255,.07); border-radius:10px; background:#121212; color:#f97316; font-size:9px; font-weight:900; }
              .edit-shell-header { grid-template-columns:minmax(0,1fr) auto; padding-inline:4px; }
              .header-copy h1 { font-size:clamp(1.45rem,7vw,2rem); }
              .header-copy p { max-width:230px; font-size:9px; line-height:1.35; }
              .header-index span { font-size:16px; }
              .edit-content-card { padding:14px 11px; border-radius:17px; }
              .active-section-heading { margin-bottom:14px; }
              .active-section-heading h2 { font-size:17px; }
              .edit-navigation { grid-template-columns:1fr 1.45fr; }
              .edit-navigation-center { display:none; }
              .secondary-action, .primary-action { width:100%; padding-inline:10px; min-height:46px; font-size:10px; }
              .danger-zone { align-items:flex-start; flex-direction:column; }
              .danger-zone button { width:100%; }
            }

            @media (max-width: 390px) {
              .edit-shell-page { padding-inline:7px; }
              .edit-shell-header { padding-inline:2px; }
              .edit-content-card { padding-inline:9px; }
            }
          `}</style>
        </main>
      );
    }

    return (
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ color: "#fff", marginBottom: "30px" }}>
          {mode === "create" ? "Nuevo Restaurante" : "Editar Restaurante"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className={`form-grid ${isWizard ? "wizard-form-grid" : ""}`}>
            {(!isWizard || showGeneral) && (
              <>
                {isWizard ? (
                  <>
                    <WolfMobileAccordion index="01" title="Información General" description="Datos básicos del restaurante" mobileOnly>
                      <GeneralSection {...sectionProps} />
                    </WolfMobileAccordion>
                    <WolfMobileAccordion index="02" title="Propietario" description="Responsable del negocio" mobileOnly>
                      <OwnerSection {...sectionProps} />
                    </WolfMobileAccordion>
                  </>
                ) : (
                  <>
                    <GeneralSection {...sectionProps} />
                    <OwnerSection {...sectionProps} />
                  </>
                )}
              </>
            )}

            {(!isWizard || showLocation) && <LocationSection {...sectionProps} />}

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

            {(!isWizard || showDelivery) && <DeliverySection {...sectionProps} />}
          </div>

          {mode === "edit" && (
            <button type="button" onClick={deleteRestaurant} style={{ marginTop: "30px", marginRight: "15px", padding: "15px 30px", borderRadius: "12px", background: "#dc2626", color: "#fff", border: "none" }}>
              Eliminar
            </button>
          )}

          {!isWizard && <SubmitSection loading={loading || uploading} mode={mode} />}
        </form>

        <style jsx>{`
          .form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; width:100%; min-width:0; box-sizing:border-box; }
          .wizard-form-grid { grid-template-columns:minmax(0,1fr); gap:14px; }
          .form-grid > * { min-width:0; max-width:100%; box-sizing:border-box; }
          @media (max-width:820px) { .form-grid { grid-template-columns:minmax(0,1fr); gap:14px; } .wizard-form-grid { gap:12px; } }
          @media (max-width:520px) { .form-grid,.wizard-form-grid { gap:10px; } }
        `}</style>
      </main>
    );
}