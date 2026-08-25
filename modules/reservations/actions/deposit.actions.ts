"use server";

import { revalidatePath } from "next/cache";

import {
  reservationDepositRepository,
  type ReservationDepositPaymentMethod,
  type ReservationDepositSettingsInput,
} from "../repositories/deposit.repository";
import { reservationDepositService } from "../services/deposit.service";
import { confirmReservationAndNotify } from "../services/reservation-confirmation.service";

export async function getReservationDepositSettings(
  restaurantId: string,
) {
  return reservationDepositService.getSettings(restaurantId);
}

export async function updateReservationDepositSettings(
  restaurantId: string,
  input: ReservationDepositSettingsInput,
) {
  const result = await reservationDepositService.updateSettings(
    restaurantId,
    input,
  );

  revalidatePath(`/admin/reservations/${restaurantId}`);
  revalidatePath("/admin/reservations");

  return result;
}

export async function createReservationDeposit(
  reservationId: string,
  restaurantId: string,
  method: ReservationDepositPaymentMethod,
) {
  const settings =
    await reservationDepositService.getSettings(restaurantId);

  const result =
    await reservationDepositService.createForReservation(
      reservationId,
      restaurantId,
      method,
      settings,
    );

  revalidatePath(`/admin/reservations/${restaurantId}`);
  revalidatePath("/admin/reservations");

  return result;
}

export async function markReservationDepositPaid(
  depositId: string,
  proofUrl?: string | null,
) {
  const deposit =
    await reservationDepositRepository.markPaid(
      depositId,
      proofUrl,
    );

  if (!deposit.reservation_id) {
    throw new Error(
      "El anticipo no tiene una reserva asociada.",
    );
  }

  const reservation =
    await confirmReservationAndNotify(
      deposit.reservation_id,
    );

  revalidatePath("/admin/reservations");

  if (deposit.restaurant_id) {
    revalidatePath(
      `/admin/reservations/${deposit.restaurant_id}`,
    );
  }

  return {
    success: true,
    deposit,
    reservation,
  };
}
