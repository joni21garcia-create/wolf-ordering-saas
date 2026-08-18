"use client";

import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  CreditCard,
  Mail,
  UserRound,
} from "lucide-react";
import { useState } from "react";

import type { RestaurantCreationRequest } from "./RestaurantRequestsPage";

type RestaurantRequestCardProps = {
  request: RestaurantCreationRequest;
};

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(value: string) {
  return (
    value
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (part) =>
          part[0]?.toUpperCase() ?? "",
      )
      .join("") || "R"
  );
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Pendiente";

    case "in_review":
      return "En revisión";

    case "completed":
      return "Completada";

    case "cancelled":
      return "Cancelada";

    default:
      return status || "Sin estado";
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "completed":
      return "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300";

    case "in_review":
      return "border-orange-400/15 bg-orange-400/[0.07] text-orange-300";

    case "cancelled":
      return "border-red-400/15 bg-red-400/[0.07] text-red-300";

    case "pending":
    default:
      return "border-white/[0.08] bg-white/[0.045] text-white/60";
  }
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] sm:text-[9px] ${getStatusClasses(
        status,
      )}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {getStatusLabel(status)}
    </span>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.05] bg-white/[0.018] px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-white/25">
        {icon}

        <span className="text-[8px] font-bold uppercase tracking-[0.12em]">
          {label}
        </span>
      </div>

      <p className="mt-1.5 truncate text-[10px] font-medium text-white/60 sm:text-[11px]">
        {value || "—"}
      </p>
    </div>
  );
}

function MiniBadge({
  children,
  success = false,
}: {
  children: React.ReactNode;
  success?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.06em] ${
        success
          ? "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300"
          : "border-white/[0.07] bg-white/[0.035] text-white/35"
      }`}
    >
      {success ? (
        <CheckCircle2 size={10} />
      ) : null}

      {children}
    </span>
  );
}

export default function RestaurantRequestCard({
  request,
}: RestaurantRequestCardProps) {
  const [copied, setCopied] =
    useState(false);

  const isLinked = Boolean(
    request.restaurant_id,
  );

  const hasPaypal = Boolean(
    request.paypal_subscription_id,
  );

  const copyPaypalId = async () => {
    if (
      !request.paypal_subscription_id
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        request.paypal_subscription_id,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <details className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] transition duration-200 hover:border-white/[0.11] hover:bg-white/[0.035]">

      {/* =========================================================
          CLOSED HEADER
          ========================================================= */}

      <summary className="flex min-h-[74px] cursor-pointer list-none items-center gap-3 px-3.5 py-3 sm:min-h-[82px] sm:px-4">

        {/* Avatar */}

        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.06] text-[10px] font-bold text-orange-300 sm:h-12 sm:w-12">
          {getInitials(
            request.restaurant_name,
          )}

          {/* Linked indicator */}

          {isLinked ? (
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#0d0d0d] bg-emerald-400 text-black">
              <Check size={9} strokeWidth={3} />
            </span>
          ) : null}
        </div>

        {/* Main identity */}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="min-w-0 truncate text-xs font-semibold text-white/85 sm:text-sm">
              {request.restaurant_name}
            </h2>
          </div>

          <p className="mt-1 truncate text-[10px] text-white/30 sm:text-[11px]">
            {request.owner_name}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white/20">
              {request.plan?.toUpperCase() ||
                "SIN PLAN"}
            </span>

            <span className="h-1 w-1 rounded-full bg-white/15" />

            <span className="text-[8px] text-white/20">
              {formatDate(
                request.created_at,
              )}
            </span>
          </div>
        </div>

        {/* Right side */}

        <div className="flex shrink-0 flex-col items-end gap-2">
          <StatusBadge
            status={
              request.request_status
            }
          />

          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.035] text-white/25 transition duration-200 group-open:bg-orange-400/[0.08] group-open:text-orange-300">
            <ChevronDown
              size={14}
              className="transition-transform duration-200 group-open:rotate-180"
            />
          </span>
        </div>
      </summary>

      {/* =========================================================
          EXPANDED CONTENT
          ========================================================= */}

      <div className="border-t border-white/[0.06] px-3.5 pb-3.5 pt-3.5 sm:px-4 sm:pb-4">

        {/* =======================================================
            QUICK STATUS STRIP
            ======================================================= */}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

          <InfoItem
            icon={
              <UserRound size={12} />
            }
            label="Propietario"
            value={
              request.owner_name
            }
          />

          <InfoItem
            icon={
              <Building2 size={12} />
            }
            label="Plan"
            value={
              request.plan?.toUpperCase() ||
              "—"
            }
          />

          <InfoItem
            icon={
              isLinked ? (
                <CheckCircle2 size={12} />
              ) : (
                <Building2 size={12} />
              )
            }
            label="Restaurante"
            value={
              isLinked
                ? "Vinculado"
                : "Pendiente"
            }
          />

          <InfoItem
            icon={
              <Clock3 size={12} />
            }
            label="Solicitud"
            value={formatDate(
              request.created_at,
            )}
          />
        </div>

        {/* =======================================================
            CONTACT
            ======================================================= */}

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <InfoItem
            icon={<Mail size={12} />}
            label="Correo"
            value={
              request.owner_email
            }
          />

          <InfoItem
            icon={<CreditCard size={12} />}
            label="Pago"
            value={
              request.payment_status ||
              "Sin estado"
            }
          />
        </div>

        {/* =======================================================
            PAYPAL
            ======================================================= */}

        {hasPaypal ? (
          <div className="mt-2 rounded-xl border border-white/[0.05] bg-black/10 px-3 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-white/30">
                  <CreditCard
                    size={12}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/25">
                    PayPal
                  </p>

                  <p className="mt-0.5 truncate font-mono text-[9px] text-white/40">
                    {
                      request.paypal_subscription_id
                    }
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyPaypalId}
                title={
                  copied
                    ? "Copiado"
                    : "Copiar ID"
                }
                aria-label={
                  copied
                    ? "ID de PayPal copiado"
                    : "Copiar ID de PayPal"
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-white/25 transition hover:border-orange-400/15 hover:text-orange-300"
              >
                {copied ? (
                  <Check
                    size={13}
                  />
                ) : (
                  <Copy
                    size={13}
                  />
                )}
              </button>
            </div>
          </div>
        ) : null}

        {/* =======================================================
            FOOTER ACTION
            ======================================================= */}

        <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.05] pt-3 sm:flex-row sm:items-center sm:justify-between">

          {/* Secondary state */}

          <div className="flex min-w-0 items-center gap-2">
            {isLinked ? (
              <MiniBadge success>
                Restaurante vinculado
              </MiniBadge>
            ) : (
              <MiniBadge>
                Requiere atención
              </MiniBadge>
            )}

            <span className="hidden truncate text-[9px] text-white/20 sm:block">
              ID: {request.id}
            </span>
          </div>

          {/* Primary action */}

          <a
            href={`/super-admin/restaurant-requests/${request.id}`}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-[9px] font-bold uppercase tracking-[0.1em] text-black transition hover:bg-orange-400 active:scale-[0.99] sm:w-auto"
          >
            Ver solicitud
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </details>
  );
}