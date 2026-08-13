"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Home,
  MapPin,
  Navigation,
  X,
} from "lucide-react";

import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  CustomerAddressLabel,
} from "@/modules/discover/types/customerAddress";

interface AddressFormProps {
  address?: CustomerAddress | null;
  isSaving?: boolean;
  onSubmit: (input: CreateCustomerAddressInput) => Promise<void> | void;
  onCancel: () => void;
}

interface FormState {
  label: CustomerAddressLabel;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  zone: string;
  reference: string;
  instructions: string;
  latitude: string;
  longitude: string;
  is_default: boolean;
}

const LABEL_OPTIONS: Array<{
  value: CustomerAddressLabel;
  label: string;
  icon: typeof Home;
}> = [
  {
    value: "Casa",
    label: "Casa",
    icon: Home,
  },
  {
    value: "Trabajo",
    label: "Trabajo",
    icon: BriefcaseBusiness,
  },
  {
    value: "Oficina",
    label: "Oficina",
    icon: BriefcaseBusiness,
  },
  {
    value: "Otra",
    label: "Otra",
    icon: MapPin,
  },
];

function getInitialState(
  address?: CustomerAddress | null,
): FormState {
  return {
    label: address?.label ?? "Casa",
    recipient_name: address?.recipient_name ?? "",
    recipient_phone: address?.recipient_phone ?? "",
    address: address?.address ?? "",
    zone: address?.zone ?? "",
    reference: address?.reference ?? "",
    instructions: address?.instructions ?? "",
    latitude:
      address?.latitude !== null &&
      address?.latitude !== undefined
        ? String(address.latitude)
        : "",
    longitude:
      address?.longitude !== null &&
      address?.longitude !== undefined
        ? String(address.longitude)
        : "",
    is_default: address?.is_default ?? false,
  };
}

export default function AddressForm({
  address,
  isSaving = false,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    getInitialState(address),
  );

  const [error, setError] = useState<string | null>(null);
  const [showLabelOptions, setShowLabelOptions] = useState(false);
  const [locating, setLocating] = useState(false);

  const isEditing = Boolean(address);

  useEffect(() => {
    setForm(getInitialState(address));
    setError(null);
    setShowLabelOptions(false);
  }, [address]);

  const selectedLabel = useMemo(
    () =>
      LABEL_OPTIONS.find(
        (option) => option.value === form.label,
      ) ?? LABEL_OPTIONS[0],
    [form.label],
  );

  const SelectedLabelIcon = selectedLabel.icon;

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
      setError(
        "Tu dispositivo no permite obtener la ubicación actual.",
      );
      return;
    }

    setError(null);
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        updateField("latitude", String(latitude));
        updateField("longitude", String(longitude));

        try {
          /*
           * Obtener GPS solo nos da coordenadas.
           * El segundo paso es reverse geocoding para convertir
           * esas coordenadas en una dirección legible.
           *
           * Usamos Nominatim/OpenStreetMap porque devuelve
           * componentes de calle, número, barrio y ciudad sin
           * necesitar una API key del navegador.
           */
          const url = new URL(
            "https://nominatim.openstreetmap.org/reverse",
          );

          url.searchParams.set("format", "jsonv2");
          url.searchParams.set("lat", String(latitude));
          url.searchParams.set("lon", String(longitude));
          url.searchParams.set("addressdetails", "1");
          url.searchParams.set("accept-language", "es");

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              "No se pudo convertir la ubicación en una dirección.",
            );
          }

          const data = (await response.json()) as {
            display_name?: string;
            address?: {
              house_number?: string;
              road?: string;
              pedestrian?: string;
              footway?: string;
              neighbourhood?: string;
              suburb?: string;
              quarter?: string;
              city_district?: string;
              city?: string;
              town?: string;
              village?: string;
              municipality?: string;
              state?: string;
            };
          };

          const address = data.address ?? {};

          /*
           * Dirección principal:
           * preferimos calle + número porque es lo más útil
           * para Delivery.
           */
          const street =
            address.road?.trim() ||
            address.pedestrian?.trim() ||
            address.footway?.trim();

          const houseNumber =
            address.house_number?.trim();

          const streetAddress = [
            street,
            houseNumber,
          ]
            .filter(Boolean)
            .join(" ")
            .trim();

          /*
           * Si el proveedor no devuelve calle, usamos
           * display_name como respaldo para no dejar el
           * formulario vacío.
           */
          const resolvedAddress =
            streetAddress ||
            data.display_name?.trim() ||
            "";

          const zone =
            address.neighbourhood?.trim() ||
            address.quarter?.trim() ||
            address.suburb?.trim() ||
            address.city_district?.trim() ||
            "";

          const city =
            address.city?.trim() ||
            address.town?.trim() ||
            address.village?.trim() ||
            address.municipality?.trim() ||
            "";

          if (resolvedAddress) {
            updateField(
              "address",
              resolvedAddress,
            );
          }

          if (zone) {
            updateField("zone", zone);
          }

          /*
           * Si no conseguimos calle, pero sí ciudad/zona,
           * avisamos sin borrar las coordenadas.
           */
          if (!resolvedAddress) {
            setError(
              city
                ? `Encontramos tu ubicación en ${city}, pero no pudimos obtener la calle. Escríbela manualmente.`
                : "Encontramos tu ubicación, pero no pudimos obtener la dirección. Escríbela manualmente.",
            );
          }
        } catch {
          /*
           * El GPS sí funcionó. Si falla el reverse geocoding,
           * conservamos lat/lng para Delivery y permitimos
           * que el usuario escriba la dirección.
           */
          setError(
            "Obtuvimos tu ubicación, pero no pudimos convertirla en una dirección. Escríbela manualmente.",
          );
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError(
          "No pudimos obtener tu ubicación. Revisa los permisos de ubicación.",
        );
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const addressValue = form.address.trim();

    if (!addressValue) {
      setError("Escribe una dirección.");
      return;
    }

    if (addressValue.length < 2) {
      setError("La dirección es demasiado corta.");
      return;
    }

    setError(null);

    const latitude = form.latitude.trim();
    const longitude = form.longitude.trim();

    const latitudeValue =
      latitude !== "" && Number.isFinite(Number(latitude))
        ? Number(latitude)
        : null;

    const longitudeValue =
      longitude !== "" && Number.isFinite(Number(longitude))
        ? Number(longitude)
        : null;

    try {
      await onSubmit({
        label: form.label,
        recipient_name:
          form.recipient_name.trim() || null,
        recipient_phone:
          form.recipient_phone.trim() || null,
        address: addressValue,
        zone: form.zone.trim() || null,
        reference: form.reference.trim() || null,
        instructions: form.instructions.trim() || null,
        latitude: latitudeValue,
        longitude: longitudeValue,
        is_default: form.is_default,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo guardar la dirección.",
      );
    }
  };

  return (
    <form
      className="address-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="address-form__intro">
        <span className="address-form__eyebrow">
          {isEditing ? "Editar dirección" : "Nueva dirección"}
        </span>

        <h3 className="address-form__title">
          {isEditing
            ? "Actualiza tu lugar"
            : "¿Dónde te entregamos?"}
        </h3>

        <p className="address-form__subtitle">
          Guarda los datos una sola vez y úsalos en cualquier
          restaurante de Wolf.
        </p>
      </div>

      <div className="address-form__body">
        <div className="address-form__section">
          <label className="address-form__field-label">
            Guardar como
          </label>

          <div className="address-form__label-picker">
            <button
              type="button"
              className="address-form__label-trigger"
              onClick={() =>
                setShowLabelOptions((current) => !current)
              }
              disabled={isSaving}
              aria-expanded={showLabelOptions}
            >
              <span className="address-form__label-trigger-main">
                <span
                  className="address-form__label-icon"
                  aria-hidden="true"
                >
                  <SelectedLabelIcon
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span>{selectedLabel.label}</span>
              </span>

              <ChevronDown
                size={16}
                strokeWidth={1.8}
                className={
                  showLabelOptions
                    ? "address-form__chevron address-form__chevron--open"
                    : "address-form__chevron"
                }
              />
            </button>

            {showLabelOptions && (
              <div className="address-form__label-options">
                {LABEL_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const active = form.label === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={
                        active
                          ? "address-form__label-option address-form__label-option--active"
                          : "address-form__label-option"
                      }
                      onClick={() => {
                        updateField("label", option.value);
                        setShowLabelOptions(false);
                      }}
                    >
                      <span className="address-form__label-option-icon">
                        <Icon
                          size={16}
                          strokeWidth={1.8}
                        />
                      </span>

                      <span>{option.label}</span>

                      {active && (
                        <Check
                          size={15}
                          strokeWidth={2.3}
                          className="address-form__label-check"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="address-form__grid">
          <div className="address-form__field">
            <label htmlFor="address-recipient-name">
              Nombre de quien recibe
            </label>

            <input
              id="address-recipient-name"
              type="text"
              value={form.recipient_name}
              onChange={(event) =>
                updateField(
                  "recipient_name",
                  event.target.value,
                )
              }
              placeholder="Ej. Joni"
              autoComplete="name"
              disabled={isSaving}
            />
          </div>

          <div className="address-form__field">
            <label htmlFor="address-recipient-phone">
              Teléfono
            </label>

            <input
              id="address-recipient-phone"
              type="tel"
              value={form.recipient_phone}
              onChange={(event) =>
                updateField(
                  "recipient_phone",
                  event.target.value,
                )
              }
              placeholder="Ej. 099..."
              autoComplete="tel"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="address-form__field">
          <div className="address-form__field-heading">
            <label htmlFor="customer-address">
              Dirección
            </label>

            <button
              type="button"
              className="address-form__location-button"
              onClick={handleUseCurrentLocation}
              disabled={isSaving || locating}
              aria-busy={locating}
            >
              {locating ? (
                <span
                  className="address-form__location-spinner"
                  aria-hidden="true"
                />
              ) : (
                <Navigation size={13} strokeWidth={2} />
              )}
              {locating
                ? "Obteniendo ubicación..."
                : "Usar ubicación"}
            </button>
          </div>

          <input
            id="customer-address"
            type="text"
            value={form.address}
            onChange={(event) =>
              updateField("address", event.target.value)
            }
            placeholder="Ej. Av. Loja y Remigio Crespo"
            autoComplete="street-address"
            disabled={isSaving}
            required
          />
        </div>

        <div className="address-form__field">
          <label htmlFor="customer-zone">
            Sector / zona
          </label>

          <input
            id="customer-zone"
            type="text"
            value={form.zone}
            onChange={(event) =>
              updateField("zone", event.target.value)
            }
            placeholder="Ej. Centro, El Vecino..."
            autoComplete="address-level2"
            disabled={isSaving}
          />
        </div>

        <div className="address-form__field">
          <label htmlFor="customer-reference">
            Referencia
          </label>

          <input
            id="customer-reference"
            type="text"
            value={form.reference}
            onChange={(event) =>
              updateField("reference", event.target.value)
            }
            placeholder="Ej. Casa blanca junto a la farmacia"
            disabled={isSaving}
          />
        </div>

        <div className="address-form__field">
          <label htmlFor="customer-instructions">
            Instrucciones para el repartidor
          </label>

          <textarea
            id="customer-instructions"
            value={form.instructions}
            onChange={(event) =>
              updateField(
                "instructions",
                event.target.value,
              )
            }
            placeholder="Ej. Tocar el timbre..."
            rows={3}
            disabled={isSaving}
          />
        </div>

        <label className="address-form__default">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(event) =>
              updateField(
                "is_default",
                event.target.checked,
              )
            }
            disabled={isSaving}
          />

          <span className="address-form__default-control">
            <span className="address-form__default-check">
              <Check size={12} strokeWidth={2.5} />
            </span>

            <span className="address-form__default-copy">
              <strong>Usar como dirección principal</strong>
              <small>
                Se seleccionará automáticamente en Delivery.
              </small>
            </span>
          </span>
        </label>

        {error && (
          <div
            className="address-form__error"
            role="alert"
          >
            {error}
          </div>
        )}
      </div>

      <div className="address-form__footer" aria-label="Acciones de dirección">
        <button
          type="button"
          className="address-form__cancel"
          onClick={onCancel}
          disabled={isSaving}
        >
          <span className="address-form__cancel-icon" aria-hidden="true">
            <X size={15} strokeWidth={2.1} />
          </span>
          <span>Cancelar</span>
        </button>

        <button
          type="submit"
          className="address-form__submit"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="address-form__spinner" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <span className="address-form__submit-icon" aria-hidden="true">
                <Check size={16} strokeWidth={2.7} />
              </span>
              <span className="address-form__submit-copy">
                <strong>{isEditing ? "Guardar cambios" : "Guardar dirección"}</strong>
                <small>Listo para usar en Delivery</small>
              </span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .address-form {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .address-form__intro {
          padding: 2px 0 5px;
        }

        .address-form__eyebrow {
          display: block;
          margin-bottom: 5px;
          color: rgba(255, 173, 61, 0.78);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .address-form__title {
          margin: 0;
          color: rgba(255, 255, 255, 0.95);
          font-size: 20px;
          font-weight: 760;
          line-height: 1.18;
          letter-spacing: -0.025em;
        }

        .address-form__subtitle {
          max-width: 430px;
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.42);
          font-size: 11px;
          font-weight: 500;
          line-height: 1.45;
        }


        .address-form__body {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          gap: 14px;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding-right: 2px;
          padding-bottom: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 138, 0, 0.25) transparent;
        }

        .address-form__section,
        .address-form__field {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .address-form__field-label,
        .address-form__field label {
          color: rgba(255, 255, 255, 0.58);
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
        }

        .address-form__label-picker {
          position: relative;
        }

        .address-form__label-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 46px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.85);
          font: inherit;
          font-size: 12.5px;
          font-weight: 650;
          cursor: pointer;
        }

        .address-form__label-trigger:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }

        .address-form__label-trigger-main {
          display: inline-flex;
          align-items: center;
          gap: 9px;
        }

        .address-form__label-icon,
        .address-form__label-option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 30px;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: rgba(255, 145, 0, 0.08);
          color: #ffad3d;
        }

        .address-form__chevron {
          color: rgba(255, 255, 255, 0.4);
          transition: transform 160ms ease;
        }

        .address-form__chevron--open {
          transform: rotate(180deg);
        }

        .address-form__label-options {
          position: absolute;
          top: calc(100% + 7px);
          right: 0;
          left: 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 3px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          background: rgba(24, 24, 24, 0.97);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .address-form__label-option {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          min-height: 42px;
          padding: 5px 8px;
          border: 0;
          border-radius: 10px;
          background: transparent;
          color: rgba(255, 255, 255, 0.68);
          font: inherit;
          font-size: 12px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
        }

        .address-form__label-option:hover,
        .address-form__label-option--active {
          background: rgba(255, 255, 255, 0.055);
          color: rgba(255, 255, 255, 0.94);
        }

        .address-form__label-option--active
          .address-form__label-option-icon {
          background: rgba(255, 145, 0, 0.11);
          color: #ffad3d;
        }

        .address-form__label-check {
          margin-left: auto;
          color: #ff9800;
        }

        .address-form__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .address-form__field-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .address-form__location-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-height: 34px;
          padding: 0 10px;
          border: 1px solid rgba(255, 145, 0, 0.22);
          border-radius: 10px;
          background: rgba(255, 145, 0, 0.06);
          color: #ffad3d;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition:
            transform 140ms ease,
            background 140ms ease,
            border-color 140ms ease;
        }

        .address-form__location-button:hover {
          border-color: rgba(255, 145, 0, 0.42);
          background: rgba(255, 145, 0, 0.10);
        }

        .address-form__location-button:active {
          transform: scale(.97);
        }

        .address-form__location-button:disabled {
          opacity: .65;
          cursor: wait;
        }

        .address-form__location-spinner {
          width: 12px;
          height: 12px;
          border: 1.5px solid rgba(255, 173, 61, .25);
          border-top-color: #ffad3d;
          border-radius: 50%;
          animation: address-location-spin .7s linear infinite;
        }

        .address-form__field input,
        .address-form__field textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 13px;
          outline: none;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.9);
          font: inherit;
          font-size: 12.5px;
          font-weight: 500;
          transition:
            border-color 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
          box-sizing: border-box;
        }

        .address-form__field input {
          height: 46px;
          padding: 0 13px;
        }

        .address-form__field textarea {
          min-height: 78px;
          padding: 12px 13px;
          resize: vertical;
          line-height: 1.45;
        }

        .address-form__field input::placeholder,
        .address-form__field textarea::placeholder {
          color: rgba(255, 255, 255, 0.24);
        }

        .address-form__field input:focus,
        .address-form__field textarea:focus {
          border-color: rgba(255, 145, 0, 0.45);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(255, 145, 0, 0.06);
        }

        .address-form__default {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.025);
          cursor: pointer;
        }

        .address-form__default > input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .address-form__default-control {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
        }

        .address-form__default-check {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 21px;
          width: 21px;
          height: 21px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.035);
          color: transparent;
        }

        .address-form__default
          > input:checked
          + .address-form__default-control
          .address-form__default-check {
          border-color: #ff9800;
          background: #ff9800;
          color: #111;
        }

        .address-form__default-copy {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .address-form__default-copy strong {
          color: rgba(255, 255, 255, 0.76);
          font-size: 10.5px;
          font-weight: 700;
        }

        .address-form__default-copy small {
          color: rgba(255, 255, 255, 0.34);
          font-size: 10px;
          font-weight: 500;
        }

        .address-form__error {
          padding: 10px 12px;
          border: 1px solid rgba(255, 90, 90, 0.2);
          border-radius: 12px;
          background: rgba(255, 70, 70, 0.055);
          color: rgba(255, 135, 135, 0.92);
          font-size: 11px;
          font-weight: 600;
          line-height: 1.4;
        }

        .address-form__footer {
          position: sticky;
          bottom: 0;
          z-index: 5;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          align-items: center;
          gap: 10px;
          flex: 0 0 auto;
          width: 100%;
          box-sizing: border-box;
          margin-top: 10px;
          padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
          border-top: 0;
          background: transparent;
        }

        .address-form__cancel,
        .address-form__submit {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          border-radius: 13px;
          font: inherit;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition:
            transform 160ms ease,
            background-color 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease,
            color 160ms ease;
        }

        .address-form__cancel {
          gap: 7px;
          min-width: 92px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          background: rgba(255, 255, 255, 0.025);
          color: rgba(255, 255, 255, 0.58);
          font-size: 11px;
          font-weight: 700;
          box-shadow: none;
        }

        .address-form__cancel-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          color: rgba(255, 255, 255, 0.48);
        }

        .address-form__cancel:hover {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.86);
          transform: translateY(-1px);
        }

        .address-form__cancel:active,
        .address-form__submit:active {
          transform: scale(0.985);
        }

        .address-form__submit {
          gap: 9px;
          min-width: 0;
          padding: 0 17px;
          border: 1px solid rgba(255, 151, 31, 0.52);
          background: #ff8a00;
          color: #16100a;
          box-shadow:
            0 7px 20px rgba(255, 138, 0, 0.16),
            inset 0 1px 0 rgba(255, 190, 91, 0.34);
        }

        .address-form__submit:hover {
          background: #ff9417;
          border-color: rgba(255, 170, 65, 0.68);
          box-shadow:
            0 9px 24px rgba(255, 138, 0, 0.21),
            inset 0 1px 0 rgba(255, 205, 120, 0.38);
          transform: translateY(-1px);
        }

        .address-form__submit-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 24px;
          width: 24px;
          height: 24px;
          color: #16100a;
        }

        .address-form__submit-copy {
          display: block;
          min-width: 0;
          text-align: left;
        }

        .address-form__submit-copy strong {
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .address-form__submit-copy small {
          display: none;
        }

        @keyframes address-location-spin {
          to {
            transform: rotate(360deg);
          }
        }

        .address-form__spinner {
            animation: none;
          }
        }
      `}</style>
    </form>
  );
}