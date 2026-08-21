"use client";

import { useTransition } from "react";

import {
  confirmReservation,
  cancelReservation,
  checkinReservation,
  completeReservation,
  noShowReservation,
} from "../actions";

import { ReservationStatus } from "@/types/reservations";

interface ReservationActionsProps {
  reservationId: string;
  status: ReservationStatus;
  onUpdated?: () => void;
}

export function ReservationActions({
  reservationId,
  status,
  onUpdated,
}: ReservationActionsProps) {
  const [loading, startTransition] =
    useTransition();

  function execute(
    action: () => Promise<any>
  ) {
    startTransition(async () => {
      try {
        const result = await action();

        if (!result?.success) {
          throw new Error(
            result?.error ??
              "No se pudo completar la acción."
          );
        }

        onUpdated?.();
      } catch (error) {
        console.error(
          "RESERVATION ACTION ERROR",
          error
        );

        window.alert(
          error instanceof Error
            ? error.message
            : "No se pudo completar la acción."
        );
      }
    });
  }

  function confirmCancel() {
    const reason =
      window.prompt(
        "Motivo de cancelación (opcional)"
      );

    void reason;

    execute(() =>
      cancelReservation(
        reservationId
      )
    );
  }

  const isPending =
    status === ReservationStatus.PENDING;

  const canCancel =
    status === ReservationStatus.PENDING ||
    status === ReservationStatus.CONFIRMED ||
    status === ReservationStatus.CHECKED_IN;

  const canNoShow =
    status === ReservationStatus.CONFIRMED ||
    status === ReservationStatus.CHECKED_IN;

  const canCheckIn =
    status === ReservationStatus.CONFIRMED;

  const canComplete =
    status === ReservationStatus.CHECKED_IN;

  return (
    <div
      className="
        flex
        flex-wrap
        gap-2
      "
    >
      {/* PENDIENTE → CONFIRMAR */}
      {isPending && (
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
          className="
            rounded-lg
            bg-green-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loading
            ? "Procesando..."
            : "Confirmar"}
        </button>
      )}

      {/* CONFIRMADA → CHECK-IN */}
      {canCheckIn && (
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
          className="
            rounded-lg
            bg-blue-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Check-in
        </button>
      )}

      {/* CHECKED-IN → COMPLETAR */}
      {canComplete && (
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
          className="
            rounded-lg
            bg-emerald-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-emerald-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Completar
        </button>
      )}

      {/* CONFIRMADA / CHECKED-IN → NO SHOW */}
      {canNoShow && (
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            const confirmed =
              window.confirm(
                "¿Marcar esta reserva como No Show?\n\nLa mesa quedará liberada."
              );

            if (!confirmed) {
              return;
            }

            execute(() =>
              noShowReservation(
                reservationId
              )
            );
          }}
          className="
            rounded-lg
            bg-orange-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-orange-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          No Show
        </button>
      )}

      {/* PENDIENTE / CONFIRMADA / CHECKED-IN → CANCELAR */}
      {canCancel && (
        <button
          type="button"
          disabled={loading}
          onClick={confirmCancel}
          className="
            rounded-lg
            bg-red-600
            px-3
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Cancelar
        </button>
      )}
    </div>
  );
}