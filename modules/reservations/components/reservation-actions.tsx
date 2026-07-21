"use client";

import { useTransition } from "react";

import {
  confirmReservation,
  cancelReservation,
  checkinReservation,
  completeReservation,
  noShowReservation,
} from "../actions";

interface ReservationActionsProps {
  reservationId: string;

  onUpdated?: () => void;
}

export function ReservationActions({
  reservationId,
  onUpdated,
}: ReservationActionsProps) {
  const [loading, startTransition] =
    useTransition();

  function execute(
    action: () => Promise<any>
  ) {
    startTransition(async () => {
      try {
        await action();

        onUpdated?.();
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          execute(() =>
            confirmReservation(
              reservationId
            )
          )
        }
        className="rounded bg-green-600 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Confirmar
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() =>
          execute(() =>
            checkinReservation(
              reservationId
            )
          )
        }
        className="rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Check-in
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() =>
          execute(() =>
            completeReservation(
              reservationId
            )
          )
        }
        className="rounded bg-emerald-600 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Completar
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() =>
          execute(() =>
            noShowReservation(
              reservationId
            )
          )
        }
        className="rounded bg-orange-600 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        No Show
      </button>

      <button
        type="button"
        disabled={loading}
        onClick={() => {
          const reason =
            window.prompt(
              "Motivo de cancelación (opcional)"
            );

          execute(() =>
            cancelReservation(
              reservationId
            )
          );
        }}
        className="rounded bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}


