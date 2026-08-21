"use server";

import { revalidatePath } from "next/cache";

import {
  tableSettingsRepository,
  type ReservationTableInput,
} from "../repositories/table-settings.repository";

export async function listReservationTables(
  restaurantId: string,
) {
  return tableSettingsRepository.list(restaurantId);
}

export async function createReservationTable(
  restaurantId: string,
  input: ReservationTableInput,
) {
  const table = await tableSettingsRepository.create(
    restaurantId,
    input,
  );

  revalidatePath(
    `/super-admin/restaurants/${restaurantId}/settings/reservations`,
  );

  return table;
}

export async function updateReservationTable(
  restaurantId: string,
  id: string,
  input: ReservationTableInput,
) {
  const table = await tableSettingsRepository.update(
    restaurantId,
    id,
    input,
  );

  revalidatePath(
    `/super-admin/restaurants/${restaurantId}/settings/reservations`,
  );

  return table;
}

export async function deleteReservationTable(
  restaurantId: string,
  id: string,
) {
  await tableSettingsRepository.remove(
    restaurantId,
    id,
  );

  revalidatePath(
    `/super-admin/restaurants/${restaurantId}/settings/reservations`,
  );

  return {
    success: true,
  };
}