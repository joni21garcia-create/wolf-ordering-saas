"use client";

import {
  BriefcaseBusiness,
  Check,
  ChevronRight,
  Ellipsis,
  Home,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import type { CustomerAddress } from "@/modules/discover/types/customerAddress";

interface AddressCardProps {
  address: CustomerAddress;
  onSelect?: (address: CustomerAddress) => void;
  onEdit?: (address: CustomerAddress) => void;
  onDelete?: (address: CustomerAddress) => void;
  onSetDefault?: (address: CustomerAddress) => void;
  selected?: boolean;
  disabled?: boolean;
}

function getAddressIcon(label: CustomerAddress["label"]) {
  switch (label) {
    case "Casa":
      return Home;

    case "Trabajo":
    case "Oficina":
      return BriefcaseBusiness;

    default:
      return MapPin;
  }
}

export default function AddressCard({
  address,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  selected = false,
  disabled = false,
}: AddressCardProps) {
  const Icon = getAddressIcon(address.label);

  const hasActions =
    Boolean(onEdit) ||
    Boolean(onDelete) ||
    Boolean(onSetDefault);

  const handleCardClick = () => {
    if (disabled) return;
    onSelect?.(address);
  };

  return (
    <article
      className={[
        "address-card",
        selected ? "address-card--selected" : "",
        address.is_default ? "address-card--default" : "",
        disabled ? "address-card--disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className="address-card__main"
        onClick={handleCardClick}
        disabled={disabled}
        aria-pressed={selected}
        aria-label={`Seleccionar dirección ${address.label}`}
      >
        <span className="address-card__icon" aria-hidden="true">
          <Icon size={20} strokeWidth={1.8} />
        </span>

        <span className="address-card__content">
          <span className="address-card__top">
            <span className="address-card__label">
              {address.label}
            </span>

            {address.is_default && (
              <span className="address-card__default">
                <Check size={11} strokeWidth={2.4} />
                Predeterminada
              </span>
            )}
          </span>

          <span className="address-card__address">
            {address.address}
          </span>

          {address.zone && (
            <span className="address-card__zone">
              {address.zone}
            </span>
          )}

          {address.reference && (
            <span className="address-card__reference">
              {address.reference}
            </span>
          )}
        </span>

        {selected && (
          <span
            className="address-card__selected"
            aria-hidden="true"
          >
            <Check size={16} strokeWidth={2.5} />
          </span>
        )}

        {!selected && onSelect && (
          <ChevronRight
            className="address-card__chevron"
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )}
      </button>

      {hasActions && (
        <div className="address-card__actions">
          <button
            type="button"
            className="address-card__menu-button"
            disabled={disabled}
            aria-label={`Opciones de ${address.label}`}
            title={`Opciones de ${address.label}`}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <MoreHorizontal size={18} strokeWidth={2} />
          </button>

          <div className="address-card__menu">
            {onSetDefault && !address.is_default && (
              <button
                type="button"
                onClick={() => onSetDefault(address)}
                disabled={disabled}
              >
                <Check size={15} />
                <span>Usar como principal</span>
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(address)}
                disabled={disabled}
              >
                <Pencil size={15} />
                <span>Editar</span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                className="address-card__menu-danger"
                onClick={() => onDelete(address)}
                disabled={disabled}
              >
                <Trash2 size={15} />
                <span>Eliminar</span>
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .address-card {
          position: relative;
          display: flex;
          width: 100%;
          overflow: visible;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 20px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.022)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.035),
            0 12px 30px rgba(0, 0, 0, 0.12);
          transition:
            transform 180ms ease,
            border-color 180ms ease,
            background 180ms ease,
            box-shadow 180ms ease;
        }

        .address-card:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 255, 255, 0.13);
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.07),
              rgba(255, 255, 255, 0.026)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.045),
            0 16px 34px rgba(0, 0, 0, 0.16);
        }

        .address-card--selected {
          border-color: rgba(255, 145, 0, 0.48);
          background:
            linear-gradient(
              145deg,
              rgba(255, 145, 0, 0.095),
              rgba(255, 255, 255, 0.025)
            );
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.045),
            0 14px 34px rgba(255, 145, 0, 0.08);
        }

        .address-card--default {
          border-color: rgba(255, 255, 255, 0.105);
        }

        .address-card--disabled {
          opacity: 0.55;
          pointer-events: none;
        }

        .address-card__main {
          position: relative;
          display: flex;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
          gap: 13px;
          padding: 16px 44px 16px 16px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
        }

        .address-card__main:focus-visible {
          outline: 2px solid rgba(255, 145, 0, 0.75);
          outline-offset: -3px;
          border-radius: 19px;
        }

        .address-card__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.045);
          color: rgba(255, 255, 255, 0.78);
        }

        .address-card--selected .address-card__icon {
          border-color: rgba(255, 145, 0, 0.25);
          background: rgba(255, 145, 0, 0.1);
          color: #ff9800;
        }

        .address-card__content {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 3px;
          padding-top: 1px;
        }

        .address-card__top {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          min-width: 0;
        }

        .address-card__label {
          color: rgba(255, 255, 255, 0.94);
          font-size: 14px;
          font-weight: 750;
          line-height: 1.25;
          letter-spacing: -0.015em;
        }

        .address-card__default {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: 3px 7px;
          border: 1px solid rgba(255, 145, 0, 0.22);
          border-radius: 999px;
          background: rgba(255, 145, 0, 0.07);
          color: #ffad3d;
          font-size: 9px;
          font-weight: 750;
          line-height: 1;
          white-space: nowrap;
        }

        .address-card__address {
          overflow: hidden;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12.5px;
          font-weight: 550;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .address-card__zone {
          overflow: hidden;
          color: rgba(255, 255, 255, 0.42);
          font-size: 11px;
          font-weight: 500;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .address-card__reference {
          overflow: hidden;
          color: rgba(255, 255, 255, 0.34);
          font-size: 10.5px;
          font-weight: 500;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .address-card__selected {
          position: absolute;
          top: 18px;
          right: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff9800;
          color: #111;
          box-shadow: 0 5px 14px rgba(255, 145, 0, 0.2);
        }

        .address-card__chevron {
          position: absolute;
          top: 50%;
          right: 15px;
          color: rgba(255, 255, 255, 0.3);
          transform: translateY(-50%);
        }

        .address-card__actions {
          position: absolute;
          top: 10px;
          right: 9px;
          z-index: 4;
        }

        .address-card__menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 0;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition:
            background 150ms ease,
            color 150ms ease;
        }

        .address-card__menu-button:hover {
          background: rgba(255, 255, 255, 0.075);
          color: rgba(255, 255, 255, 0.85);
        }

        .address-card__menu {
          position: absolute;
          top: 37px;
          right: 0;
          display: none;
          min-width: 185px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          background: rgba(25, 25, 25, 0.96);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .address-card__actions:hover .address-card__menu,
        .address-card__actions:focus-within .address-card__menu {
          display: flex;
          flex-direction: column;
        }

        .address-card__menu button {
          display: flex;
          align-items: center;
          gap: 9px;
          width: 100%;
          min-height: 36px;
          padding: 0 10px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: rgba(255, 255, 255, 0.72);
          font: inherit;
          font-size: 11.5px;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
        }

        .address-card__menu button:hover {
          background: rgba(255, 255, 255, 0.065);
          color: rgba(255, 255, 255, 0.95);
        }

        .address-card__menu-danger {
          color: rgba(255, 100, 100, 0.82) !important;
        }

        .address-card__menu-danger:hover {
          background: rgba(255, 70, 70, 0.08) !important;
          color: rgba(255, 120, 120, 0.98) !important;
        }

        @media (max-width: 420px) {
          .address-card__main {
            padding-right: 40px;
          }

          .address-card__address {
            max-width: 220px;
          }

          .address-card__reference {
            max-width: 210px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .address-card {
            transition: none;
          }

          .address-card__menu-button {
            transition: none;
          }
        }
      `}</style>
    </article>
  );
}