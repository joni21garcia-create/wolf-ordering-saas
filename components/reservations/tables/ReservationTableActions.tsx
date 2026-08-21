"use client";

import { useState } from "react";
import type { Reservation } from "@/types/reservations";
import { ReservationStatus } from "@/types/reservations";
import {
  Check,
  CircleX,
  LogIn,
  Loader2,
} from "lucide-react";

import {
  confirmReservation,
  cancelReservation,
  checkinReservation,
} from "@/modules/reservations/actions";

interface ReservationTableActionsProps {
  reservation: Reservation;
  onRefresh?: () => void;
}

type Action = "confirm" | "cancel" | "checkin" | null;

export function ReservationTableActions({
  reservation,
  onRefresh,
}: ReservationTableActionsProps) {
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
      console.error("Reservation action error:", err);
      setError("No se pudo actualizar la reserva.");
    } finally {
      setBusy(null);
    }
  }

  const status = reservation.status;

  const canCancel =
    status !== ReservationStatus.CANCELLED &&
    status !== ReservationStatus.COMPLETED &&
    status !== ReservationStatus.NO_SHOW;

  return (
    <div className="flex min-w-[150px] flex-col items-center gap-1.5">
      <div className="flex items-center justify-center gap-1.5">
        {status === ReservationStatus.PENDING ? (
          <ActionButton
            label="Confirmar"
            icon={<Check className="h-3.5 w-3.5" />}
            disabled={Boolean(busy)}
            loading={busy === "confirm"}
            onClick={() =>
              run("confirm", () =>
                confirmReservation(reservation.id)
              )
            }
            tone="success"
          />
        ) : null}

        {status === ReservationStatus.CONFIRMED ? (
          <ActionButton
            label="Check-in"
            icon={<LogIn className="h-3.5 w-3.5" />}
            disabled={Boolean(busy)}
            loading={busy === "checkin"}
            onClick={() =>
              run("checkin", () =>
                checkinReservation(reservation.id)
              )
            }
            tone="primary"
          />
        ) : null}

        {canCancel ? (
          <ActionButton
            label="Cancelar"
            icon={<CircleX className="h-3.5 w-3.5" />}
            disabled={Boolean(busy)}
            loading={busy === "cancel"}
            onClick={() =>
              run("cancel", () =>
                cancelReservation(reservation.id)
              )
            }
            tone="danger"
          />
        ) : null}
      </div>

      {error ? (
        <span className="max-w-[180px] text-center text-[10px] font-medium text-red-600">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  loading,
  disabled,
  tone,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
  tone: "success" | "primary" | "danger";
}) {
  const toneClasses = {
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
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex h-8 items-center gap-1.5 rounded-lg
        border px-2.5 text-[11px] font-semibold
        transition active:scale-[.98]
        disabled:cursor-not-allowed disabled:opacity-50
        ${toneClasses[tone]}
      `}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        icon
      )}
      <span>{loading ? "Guardando…" : label}</span>
    </button>
  );
}