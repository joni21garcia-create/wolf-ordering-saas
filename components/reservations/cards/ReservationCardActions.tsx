"use client";

import { useState } from "react";
import { Check, CircleX, Loader2, LogIn } from "lucide-react";
import type { Reservation } from "@/types/reservations";
import { ReservationStatus } from "@/types/reservations";
import {
  cancelReservation,
  checkinReservation,
  confirmReservation,
} from "@/modules/reservations/actions";

interface ReservationCardActionsProps {
  reservation: Reservation;
  onRefresh?: () => void;
}

type Action = "confirm" | "checkin" | "cancel" | null;

export function ReservationCardActions({
  reservation,
  onRefresh,
}: ReservationCardActionsProps) {
  const [busy, setBusy] = useState<Action>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(
    action: Exclude<Action, null>,
    callback: () => Promise<unknown>
  ) {
    if (busy) return;

    setBusy(action);
    setError(null);

    try {
      await callback();
      onRefresh?.();
    } catch (err) {
      console.error("Reservation card action error:", err);
      setError("No se pudo actualizar.");
    } finally {
      setBusy(null);
    }
  }

  const canCancel = ![
    ReservationStatus.CANCELLED,
    ReservationStatus.COMPLETED,
    ReservationStatus.NO_SHOW,
  ].includes(reservation.status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {reservation.status === ReservationStatus.PENDING ? (
        <ActionButton
          label="Confirmar"
          icon={<Check className="h-3.5 w-3.5" />}
          tone="success"
          loading={busy === "confirm"}
          disabled={Boolean(busy)}
          onClick={() =>
            run("confirm", () => confirmReservation(reservation.id))
          }
        />
      ) : null}

      {reservation.status === ReservationStatus.CONFIRMED ? (
        <ActionButton
          label="Check-in"
          icon={<LogIn className="h-3.5 w-3.5" />}
          tone="primary"
          loading={busy === "checkin"}
          disabled={Boolean(busy)}
          onClick={() =>
            run("checkin", () => checkinReservation(reservation.id))
          }
        />
      ) : null}

      {canCancel ? (
        <ActionButton
          label="Cancelar"
          icon={<CircleX className="h-3.5 w-3.5" />}
          tone="danger"
          loading={busy === "cancel"}
          disabled={Boolean(busy)}
          onClick={() =>
            run("cancel", () => cancelReservation(reservation.id))
          }
        />
      ) : null}

      {error ? (
        <span className="basis-full text-xs font-medium text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  tone,
  loading,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  tone: "success" | "primary" | "danger";
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const tones = {
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    primary:
      "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
    danger:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]}`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        icon
      )}
      {loading ? "Guardando…" : label}
    </button>
  );
}