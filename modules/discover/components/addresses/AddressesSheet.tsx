"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  MapPin,
  Plus,
  X,
} from "lucide-react";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import AddressesEmptyState from "./AddressesEmptyState";

import { useCustomerAddresses } from "@/modules/discover/hooks/useCustomerAddresses";

import type {
  CreateCustomerAddressInput,
  CustomerAddress,
  UpdateCustomerAddressInput,
} from "@/modules/discover/types/customerAddress";

interface AddressesSheetProps {
  open: boolean;
  onClose: () => void;

  /**
   * Se ejecuta cuando el usuario selecciona una dirección.
   *
   * Es opcional porque desde Discover podemos abrir el sheet
   * únicamente para administrar direcciones.
   *
   * Checkout podrá utilizarlo posteriormente para seleccionar
   * una dirección y recibirla directamente.
   */
  onSelect?: (address: CustomerAddress) => void;

  /**
   * Dirección que debe aparecer seleccionada inicialmente.
   */
  selectedAddressId?: string | null;
}

type SheetView = "list" | "create" | "edit";

export default function AddressesSheet({
  open,
  onClose,
  onSelect,
  selectedAddressId = null,
}: AddressesSheetProps) {
  const {
    addresses,
    defaultAddress,
    isLoading,
    isSaving,
    error,
    create,
    update,
    remove,
    setDefault,
    clearError,
  } = useCustomerAddresses();

  const [view, setView] = useState<SheetView>("list");
  const [editingAddress, setEditingAddress] =
    useState<CustomerAddress | null>(null);

  const [localSelectedId, setLocalSelectedId] = useState<
    string | null
  >(selectedAddressId);

  const [deleteCandidate, setDeleteCandidate] =
    useState<CustomerAddress | null>(null);

  /**
   * Mantiene sincronizada la selección externa.
   */
  useEffect(() => {
    setLocalSelectedId(selectedAddressId);
  }, [selectedAddressId]);

  /**
   * Cada vez que el sheet se abre comenzamos en la lista.
   */
  useEffect(() => {
    if (!open) return;

    setView("list");
    setEditingAddress(null);
    setDeleteCandidate(null);
    clearError();
  }, [open, clearError]);

  /**
   * Bloqueamos el scroll de la página mientras el Bottom Sheet
   * está abierto.
   */
  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  /**
   * Escape cierra el sheet.
   *
   * Si estamos dentro del formulario, primero regresamos a la lista.
   */
  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (deleteCandidate) {
        setDeleteCandidate(null);
        return;
      }

      if (view !== "list") {
        setView("list");
        setEditingAddress(null);
        clearError();
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    open,
    view,
    deleteCandidate,
    onClose,
    clearError,
  ]);

  const selectedAddress = useMemo(() => {
    if (!localSelectedId) {
      return null;
    }

    return (
      addresses.find(
        (address) => address.id === localSelectedId,
      ) ?? null
    );
  }, [addresses, localSelectedId]);

  /**
   * Abre formulario para crear.
   */
  const handleAdd = useCallback(() => {
    clearError();
    setEditingAddress(null);
    setView("create");
  }, [clearError]);

  /**
   * Abre formulario para editar.
   */
  const handleEdit = useCallback(
    (address: CustomerAddress) => {
      clearError();
      setEditingAddress(address);
      setView("edit");
    },
    [clearError],
  );

  /**
   * Crea una dirección.
   */
  const handleCreate = useCallback(
    async (input: CreateCustomerAddressInput) => {
      const created = await create(input);

      if (!created) {
        return;
      }

      setEditingAddress(null);
      setView("list");
    },
    [create],
  );

  /**
   * Actualiza una dirección.
   */
  const handleUpdate = useCallback(
    async (
      input: CreateCustomerAddressInput,
    ) => {
      if (!editingAddress) {
        return;
      }

      const updateInput: UpdateCustomerAddressInput = {
        label: input.label,
        recipient_name: input.recipient_name,
        recipient_phone: input.recipient_phone,
        email: input.email,
        address: input.address,
        zone: input.zone,
        reference: input.reference,
        instructions: input.instructions,
        latitude: input.latitude,
        longitude: input.longitude,
        is_default: input.is_default,
      };

      const updated = await update(
        editingAddress.id,
        updateInput,
      );

      if (!updated) {
        return;
      }

      setEditingAddress(null);
      setView("list");
    },
    [editingAddress, update],
  );

  /**
   * Selecciona una dirección.
   */
  const handleSelect = useCallback(
    (address: CustomerAddress) => {
      setLocalSelectedId(address.id);

      onSelect?.(address);
    },
    [onSelect],
  );

  /**
   * Establece una dirección como principal.
   */
  const handleSetDefault = useCallback(
    async (address: CustomerAddress) => {
      const updated = await setDefault(address.id);

      if (updated) {
        setLocalSelectedId(updated.id);
      }
    },
    [setDefault],
  );

  /**
   * Abre confirmación de eliminación.
   */
  const handleDeleteRequest = useCallback(
    (address: CustomerAddress) => {
      setDeleteCandidate(address);
      clearError();
    },
    [clearError],
  );

  /**
   * Confirma eliminación.
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteCandidate) {
      return;
    }

    const addressId = deleteCandidate.id;

    const deleted = await remove(addressId);

    if (!deleted) {
      return;
    }

    if (localSelectedId === addressId) {
      setLocalSelectedId(null);
    }

    setDeleteCandidate(null);
  }, [
    deleteCandidate,
    remove,
    localSelectedId,
  ]);

  /**
   * Volver desde formulario.
   */
  const handleFormCancel = useCallback(() => {
    if (isSaving) {
      return;
    }

    clearError();
    setEditingAddress(null);
    setView("list");
  }, [clearError, isSaving]);

  /**
   * Si el componente no está abierto no renderizamos nada.
   */
  if (!open) {
    return null;
  }

  const isFormView =
    view === "create" || view === "edit";

  return (
    <div
      className="addresses-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addresses-sheet-title"
    >
      <button
        type="button"
        className="addresses-sheet__backdrop"
        onClick={() => {
          if (isFormView) {
            handleFormCancel();
            return;
          }

          if (!deleteCandidate) {
            onClose();
          }
        }}
        aria-label="Cerrar direcciones"
      />

      <section className="addresses-sheet__panel">
        <div className="addresses-sheet__handle" />

        <header className="addresses-sheet__header">
          <div className="addresses-sheet__heading">
            {isFormView ? (
              <button
                type="button"
                className="addresses-sheet__back-button"
                onClick={handleFormCancel}
                disabled={isSaving}
                aria-label="Volver a mis direcciones"
              >
                <span aria-hidden="true">←</span>
              </button>
            ) : (
              <span
                className="addresses-sheet__title-icon"
                aria-hidden="true"
              >
                <MapPin
                  size={18}
                  strokeWidth={1.8}
                />
              </span>
            )}

            <div className="addresses-sheet__heading-copy">
              <span className="addresses-sheet__eyebrow">
                Wolf Ordering
              </span>

              <h2
                id="addresses-sheet-title"
                className="addresses-sheet__title"
              >
                {isFormView
                  ? view === "edit"
                    ? "Editar dirección"
                    : "Nueva dirección"
                  : "Mis direcciones"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="addresses-sheet__close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Cerrar"
          >
            <X
              size={18}
              strokeWidth={1.9}
            />
          </button>
        </header>

        <div className="addresses-sheet__content">
          {isFormView ? (
            <AddressForm
              address={
                view === "edit"
                  ? editingAddress
                  : null
              }
              isSaving={isSaving}
              onSubmit={
                view === "edit"
                  ? handleUpdate
                  : handleCreate
              }
              onCancel={handleFormCancel}
            />
          ) : (
            <>
              <div className="addresses-sheet__intro">
                <div>
                  <p className="addresses-sheet__intro-title">
                    Tus lugares guardados
                  </p>

                  <p className="addresses-sheet__intro-copy">
                    Úsalos para pedir más rápido en
                    cualquier restaurante.
                  </p>
                </div>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    className="addresses-sheet__add-button"
                    onClick={handleAdd}
                  >
                    <Plus
                      size={16}
                      strokeWidth={2.2}
                    />
                    <span>Agregar</span>
                  </button>
                )}
              </div>

              {error && (
                <div
                  className="addresses-sheet__error"
                  role="alert"
                >
                  <span>{error}</span>

                  <button
                    type="button"
                    onClick={clearError}
                  >
                    Cerrar
                  </button>
                </div>
              )}

              <div className="addresses-sheet__list">
                {isLoading ? (
                  <div
                    className="addresses-sheet__loading"
                    aria-live="polite"
                  >
                    <span className="addresses-sheet__loader" />

                    <span>
                      Cargando tus direcciones...
                    </span>
                  </div>
                ) : addresses.length === 0 ? (
                  <AddressesEmptyState
                    onAdd={handleAdd}
                  />
                ) : (
                  <>
                    {addresses.map((address) => (
                      <AddressCard
                        key={address.id}
                        address={address}
                        selected={
                          localSelectedId ===
                          address.id
                        }
                        disabled={isSaving}
                        onSelect={
                          onSelect
                            ? handleSelect
                            : undefined
                        }
                        onEdit={handleEdit}
                        onDelete={
                          handleDeleteRequest
                        }
                        onSetDefault={
                          handleSetDefault
                        }
                      />
                    ))}
                  </>
                )}
              </div>

              {addresses.length > 0 &&
                defaultAddress && (
                  <div className="addresses-sheet__hint">
                    <Check
                      size={14}
                      strokeWidth={2.2}
                    />

                    <span>
                      <strong>
                        {defaultAddress.label}
                      </strong>{" "}
                      es tu dirección principal.
                    </span>
                  </div>
                )}

              {selectedAddress &&
                onSelect && (
                  <div className="addresses-sheet__selection">
                    <div>
                      <span>
                        Dirección seleccionada
                      </span>

                      <strong>
                        {selectedAddress.label}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onSelect(selectedAddress)
                      }
                    >
                      Usar esta
                    </button>
                  </div>
                )}
            </>
          )}
        </div>
      </section>

      {deleteCandidate && (
        <div
          className="addresses-sheet__confirm-layer"
          role="presentation"
        >
          <button
            type="button"
            className="addresses-sheet__confirm-backdrop"
            onClick={() =>
              setDeleteCandidate(null)
            }
            aria-label="Cancelar eliminación"
          />

          <div
            className="addresses-sheet__confirm"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-address-title"
          >
            <div className="addresses-sheet__confirm-icon">
              <MapPin
                size={20}
                strokeWidth={1.8}
              />
            </div>

            <h3 id="delete-address-title">
              ¿Eliminar esta dirección?
            </h3>

            <p>
              Se eliminará{" "}
              <strong>
                {deleteCandidate.label}
              </strong>{" "}
              de tus lugares guardados.
            </p>

            <div className="addresses-sheet__confirm-actions">
              <button
                type="button"
                className="addresses-sheet__confirm-cancel"
                onClick={() =>
                  setDeleteCandidate(null)
                }
                disabled={isSaving}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="addresses-sheet__confirm-delete"
                onClick={handleDeleteConfirm}
                disabled={isSaving}
              >
                {isSaving
                  ? "Eliminando..."
                  : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .addresses-sheet {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          pointer-events: auto;
        }

        .addresses-sheet__backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          padding: 0;
          background: rgba(0, 0, 0, 0.56);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          animation: addresses-backdrop-in 220ms ease both;
        }

        .addresses-sheet__panel {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          width: min(100%, 620px);
          max-height: min(88vh, 820px);
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-bottom: 0;
          border-radius: 28px 28px 0 0;
          background:
            radial-gradient(
              circle at 50% -20%,
              rgba(255, 145, 0, 0.055),
              transparent 38%
            ),
            rgba(19, 19, 19, 0.97);
          box-shadow:
            0 -24px 70px rgba(0, 0, 0, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.045);
          backdrop-filter: blur(26px);
          -webkit-backdrop-filter: blur(26px);
          animation: addresses-sheet-in 320ms
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .addresses-sheet__handle {
          flex: 0 0 auto;
          width: 38px;
          height: 4px;
          margin: 9px auto 2px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.18);
        }

        .addresses-sheet__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex: 0 0 auto;
          padding: 15px 20px 13px;
        }

        .addresses-sheet__heading {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 11px;
        }

        .addresses-sheet__title-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255, 145, 0, 0.18);
          border-radius: 12px;
          background: rgba(255, 145, 0, 0.075);
          color: #ffad3d;
        }

        .addresses-sheet__back-button,
        .addresses-sheet__close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.62);
          cursor: pointer;
          transition:
            background 160ms ease,
            color 160ms ease,
            transform 160ms ease;
        }

        .addresses-sheet__back-button {
          font-size: 22px;
          line-height: 1;
        }

        .addresses-sheet__back-button:hover,
        .addresses-sheet__close:hover {
          background: rgba(255, 255, 255, 0.07);
          color: rgba(255, 255, 255, 0.92);
          transform: translateY(-1px);
        }

        .addresses-sheet__heading-copy {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .addresses-sheet__eyebrow {
          margin-bottom: 2px;
          color: rgba(255, 255, 255, 0.32);
          font-size: 8.5px;
          font-weight: 750;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .addresses-sheet__title {
          margin: 0;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.95);
          font-size: 18px;
          font-weight: 760;
          line-height: 1.2;
          letter-spacing: -0.025em;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .addresses-sheet__content {
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 0 20px calc(20px + env(safe-area-inset-bottom));
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.12)
            transparent;
        }

        .addresses-sheet__content::-webkit-scrollbar {
          width: 4px;
        }

        .addresses-sheet__content::-webkit-scrollbar-track {
          background: transparent;
        }

        .addresses-sheet__content::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
        }

        .addresses-sheet__intro {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 5px 1px 17px;
        }

        .addresses-sheet__intro-title {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 11.5px;
          font-weight: 700;
        }

        .addresses-sheet__intro-copy {
          max-width: 370px;
          margin: 3px 0 0;
          color: rgba(255, 255, 255, 0.36);
          font-size: 10.5px;
          font-weight: 500;
          line-height: 1.4;
        }

        .addresses-sheet__add-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 0 0 auto;
          min-height: 36px;
          padding: 0 12px;
          border: 1px solid rgba(255, 145, 0, 0.28);
          border-radius: 11px;
          background: rgba(255, 145, 0, 0.065);
          color: #ffad3d;
          font: inherit;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            transform 160ms ease;
        }

        .addresses-sheet__add-button:hover {
          border-color: rgba(255, 145, 0, 0.48);
          background: rgba(255, 145, 0, 0.105);
          transform: translateY(-1px);
        }

        .addresses-sheet__list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 0;
        }

        .addresses-sheet__loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 190px;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          font-weight: 600;
        }

        .addresses-sheet__loader {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.12);
          border-top-color: #ff9800;
          border-radius: 50%;
          animation: addresses-spin 700ms linear
            infinite;
        }

        .addresses-sheet__error {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 11px;
          padding: 9px 11px;
          border: 1px solid rgba(255, 80, 80, 0.18);
          border-radius: 12px;
          background: rgba(255, 70, 70, 0.05);
          color: rgba(255, 135, 135, 0.9);
          font-size: 10.5px;
          font-weight: 600;
          line-height: 1.35;
        }

        .addresses-sheet__error button {
          flex: 0 0 auto;
          border: 0;
          padding: 0;
          background: transparent;
          color: rgba(255, 160, 160, 0.8);
          font: inherit;
          font-size: 9.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .addresses-sheet__hint {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          padding: 9px 11px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.34);
          font-size: 9.5px;
          font-weight: 500;
        }

        .addresses-sheet__hint svg {
          flex: 0 0 auto;
          color: #ffad3d;
        }

        .addresses-sheet__hint strong {
          color: rgba(255, 255, 255, 0.56);
          font-weight: 700;
        }

        .addresses-sheet__selection {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-top: 12px;
          padding: 11px 12px;
          border: 1px solid rgba(255, 145, 0, 0.2);
          border-radius: 13px;
          background: rgba(255, 145, 0, 0.045);
        }

        .addresses-sheet__selection > div {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .addresses-sheet__selection span {
          color: rgba(255, 255, 255, 0.36);
          font-size: 9px;
          font-weight: 600;
        }

        .addresses-sheet__selection strong {
          overflow: hidden;
          color: rgba(255, 255, 255, 0.78);
          font-size: 11px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .addresses-sheet__selection button {
          flex: 0 0 auto;
          min-height: 32px;
          padding: 0 11px;
          border: 0;
          border-radius: 9px;
          background: #ff9800;
          color: #151515;
          font: inherit;
          font-size: 9.5px;
          font-weight: 750;
          cursor: pointer;
        }

        .addresses-sheet__confirm-layer {
          position: fixed;
          inset: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .addresses-sheet__confirm-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .addresses-sheet__confirm {
          position: relative;
          z-index: 1;
          width: min(100%, 350px);
          padding: 22px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 22px;
          background: rgba(25, 25, 25, 0.98);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.45);
          animation: addresses-confirm-in 180ms ease both;
        }

        .addresses-sheet__confirm-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          margin-bottom: 14px;
          border-radius: 13px;
          background: rgba(255, 70, 70, 0.08);
          color: rgba(255, 125, 125, 0.88);
        }

        .addresses-sheet__confirm h3 {
          margin: 0;
          color: rgba(255, 255, 255, 0.92);
          font-size: 16px;
          font-weight: 750;
          letter-spacing: -0.02em;
        }

        .addresses-sheet__confirm p {
          margin: 7px 0 0;
          color: rgba(255, 255, 255, 0.43);
          font-size: 11px;
          line-height: 1.5;
        }

        .addresses-sheet__confirm p strong {
          color: rgba(255, 255, 255, 0.7);
        }

        .addresses-sheet__confirm-actions {
          display: flex;
          gap: 8px;
          margin-top: 19px;
        }

        .addresses-sheet__confirm-actions button {
          flex: 1;
          min-height: 40px;
          border-radius: 11px;
          font: inherit;
          font-size: 10.5px;
          font-weight: 700;
          cursor: pointer;
        }

        .addresses-sheet__confirm-cancel {
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.62);
        }

        .addresses-sheet__confirm-delete {
          border: 1px solid rgba(255, 80, 80, 0.22);
          background: rgba(255, 70, 70, 0.09);
          color: rgba(255, 130, 130, 0.92);
        }

        .addresses-sheet__confirm-delete:hover {
          background: rgba(255, 70, 70, 0.14);
        }

        .addresses-sheet__confirm-actions button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .addresses-sheet__close:disabled,
        .addresses-sheet__back-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes addresses-backdrop-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes addresses-sheet-in {
          from {
            opacity: 0;
            transform: translateY(100%);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes addresses-confirm-in {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(5px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes addresses-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 520px) {
          .addresses-sheet__panel {
            width: 100%;
            max-height: 92vh;
            border-right: 0;
            border-left: 0;
            border-radius: 25px 25px 0 0;
          }

          .addresses-sheet__header {
            padding-right: 16px;
            padding-left: 16px;
          }

          .addresses-sheet__content {
            padding-right: 16px;
            padding-left: 16px;
          }

          .addresses-sheet__intro {
            align-items: flex-start;
          }

          .addresses-sheet__intro-copy {
            max-width: 260px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .addresses-sheet__backdrop,
          .addresses-sheet__panel,
          .addresses-sheet__confirm {
            animation: none;
          }

          .addresses-sheet__back-button,
          .addresses-sheet__close,
          .addresses-sheet__add-button {
            transition: none;
          }

          .addresses-sheet__loader {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}