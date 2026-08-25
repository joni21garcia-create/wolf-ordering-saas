"use server";

import { revalidatePath } from "next/cache";

import { reservationRepository } from "./repositories/reservation.repository";
import { availabilityRepository } from "./repositories/availability.repository";
import {
  settingsRepository,
  type ReservationSettingsInput,
} from "./repositories/settings.repository";
import {
  reservationBlockService,
} from "./services/reservation-block.service";

import {
  sendReservationCancelled,
} from "@/lib/email/reservations/sendReservationCancelled";
import {
  sendReservationConfirmed,
} from "@/lib/email/reservations/sendReservationConfirmed";
import {
  sendReservationCreated,
} from "@/lib/email/reservations/sendReservationCreated";

import type {
  CreateReservationDto,
  UpdateReservationDto,
} from "@/types/reservations/reservation";

import type {
  CreateReservationBlockInput,
  UpdateReservationBlockInput,
} from "./repositories/reservation-block.repository";

import {
  paymentService,
  type CreateReservationDepositInput,
} from "./services/payment.service";

import {
  getReservationDepositSettings as getDepositSettingsAction,
  updateReservationDepositSettings as updateDepositSettingsAction,
  createReservationDeposit as createDepositAction,
  markReservationDepositPaid as markDepositPaidAction,
} from "./actions/deposit.actions";

import type {
  ReservationDepositPaymentMethod,
  ReservationDepositSettingsInput,
} from "./repositories/deposit.repository";

function revalidateReservationPaths() {
  revalidatePath("/admin/reservations");
}

/**
 * El correo es secundario respecto a la operación de reserva.
 * Si Resend falla, la reserva ya guardada/actualizada no debe fallar.
 */
async function sendReservationEmailSafely(
  send: () => Promise<unknown>,
  context: string
) {
  try {
    await send();
  } catch (error) {
    console.error(`${context} ERROR`, error);
  }
}

/* =========================================================
 * RESERVAS
 * ======================================================= */

export async function confirmReservation(
  id: string
) {
  const reservation =
    await reservationRepository.confirm(id);

  await sendReservationEmailSafely(
    () => sendReservationConfirmed(id),
    "SEND RESERVATION CONFIRMED EMAIL"
  );

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

export async function cancelReservation(
  id: string
) {
  const reservation =
    await reservationRepository.cancel(id);

  await sendReservationEmailSafely(
    () =>
      sendReservationCancelled(
        id,
        "restaurant"
      ),
    "SEND RESTAURANT CANCELLATION EMAIL"
  );

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

/**
 * Cancela una reserva desde el flujo público respetando la política
 * de cancelación del restaurante.
 */
export async function cancelReservationByCustomer(
  id: string
) {
  const reservation =
    await reservationRepository.cancelByCustomer(id);

  await sendReservationEmailSafely(
    () =>
      sendReservationCancelled(
        id,
        "customer"
      ),
    "SEND CUSTOMER CANCELLATION EMAIL"
  );

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

/**
 * Permite consultar si una reserva puede ser cancelada por el cliente.
 */
export async function canCancelReservation(
  id: string
) {
  return reservationRepository.canCustomerCancel(id);
}

export async function checkinReservation(
  id: string
) {
  const reservation =
    await reservationRepository.checkIn(id);

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

export async function completeReservation(
  id: string
) {
  const reservation =
    await reservationRepository.complete(id);

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

export async function noShowReservation(
  id: string
) {
  const reservation =
    await reservationRepository.noShow(id);

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

export async function createReservation(
  data: CreateReservationDto
) {
  // El repository ya aplica auto_confirm y devuelve
  // PENDING o CONFIRMED según la configuración real del restaurante.
  const reservation =
    await reservationRepository.create(data);

  // El correo depende del estado final de la reserva:
  // - pending: solicitud recibida
  // - confirmed: confirmación automática
  if (reservation.status === "confirmed") {
    await sendReservationEmailSafely(
      () => sendReservationConfirmed(reservation.id),
      "SEND RESERVATION AUTO-CONFIRMED EMAIL"
    );
  } else {
    await sendReservationEmailSafely(
      () => sendReservationCreated(reservation.id),
      "SEND RESERVATION CREATED EMAIL"
    );
  }

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

export async function getReservation(
  id: string
) {
  return reservationRepository.findById(id);
}

export async function updateReservation(
  id: string,
  data: UpdateReservationDto
) {
  const reservation =
    await reservationRepository.update(
      id,
      data
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: reservation,
  };
}

/* =========================================================
 * CONFIGURACIÓN / POLÍTICAS DE RESERVAS
 * ======================================================= */

/**
 * Obtiene la configuración completa de reservas.
 * Si aún no existe, getOrCreate la crea con los defaults de la base.
 */
export async function getReservationSettings(
  restaurantId: string
) {
  return settingsRepository.getOrCreate(
    restaurantId
  );
}

/**
 * Obtiene la política normalizada que consumirán
 * disponibilidad y las futuras pantallas de reserva.
 */
export async function getReservationPolicy(
  restaurantId: string
) {
  return settingsRepository.getPolicy(
    restaurantId
  );
}

/**
 * Actualiza parcialmente la configuración.
 */
export async function updateReservationSettings(
  restaurantId: string,
  data: ReservationSettingsInput
) {
  const settings =
    await settingsRepository.update(
      restaurantId,
      data
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: settings,
  };
}

/**
 * Guarda la configuración completa mediante upsert.
 */
export async function upsertReservationSettings(
  restaurantId: string,
  data: ReservationSettingsInput
) {
  const settings =
    await settingsRepository.upsert(
      restaurantId,
      data
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: settings,
  };
}

/**
 * Restaura los valores operativos principales
 * a los defaults definidos por el dominio.
 */
export async function resetReservationAvailabilityPolicy(
  restaurantId: string
) {
  const settings =
    await settingsRepository.resetAvailabilityPolicy(
      restaurantId
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: settings,
  };
}

/* =========================================================
 * DISPONIBILIDAD
 * ======================================================= */

export async function getAvailableReservationDates(
  restaurantId: string
) {
  return availabilityRepository.getAvailableDates(
    restaurantId
  );
}

export async function getAvailableReservationTimes(
  restaurantId: string,
  date: string,
  guests = 1
) {
  return availabilityRepository.getAvailableTimes(
    restaurantId,
    date,
    guests
  );
}

/* =========================================================
 * ESTADÍSTICAS
 * ======================================================= */

export async function getReservationStatistics(
  restaurantId: string
) {
  const {
    data: reservations,
  } =
    await reservationRepository.list(
      restaurantId
    );

  const total =
    reservations.length;

  const confirmed =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "confirmed"
    ).length;

  const pending =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "pending"
    ).length;

  const checkedIn =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "checked_in"
    ).length;

  const finished =
    reservations.filter(
      (reservation) =>
        reservation.status ===
          "completed" ||
        reservation.status ===
          "finished"
    ).length;

  const cancelled =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "cancelled"
    ).length;

  const noShow =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "no_show"
    ).length;

  const activeReservations =
    reservations.filter(
      (reservation) =>
        ![
          "cancelled",
          "completed",
          "finished",
          "no_show",
        ].includes(
          reservation.status
        )
    );

  const occupiedGuests =
    activeReservations.reduce(
      (
        totalGuests,
        reservation
      ) =>
        totalGuests +
        Number(
          reservation.guests ?? 0
        ),
      0
    );

  const totalCapacity =
    reservations.reduce(
      (
        capacity,
        reservation
      ) =>
        capacity +
        Number(
          reservation.guests ?? 0
        ),
      0
    );

  const occupancyPercentage =
    totalCapacity > 0
      ? Math.round(
          (occupiedGuests /
            totalCapacity) *
            100
        )
      : 0;

  return {
    total,
    confirmed,
    pending,
    checkedIn,
    finished,
    cancelled,
    noShow,
    occupancyPercentage,
  };
}

/* =========================================================
 * BLOQUEOS / EVENTOS / CIERRES
 * ======================================================= */

export async function createReservationBlock(
  data: CreateReservationBlockInput
) {
  const block =
    await reservationBlockService.create(
      data
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: block,
  };
}

export async function updateReservationBlock(
  id: string,
  data: UpdateReservationBlockInput
) {
  const block =
    await reservationBlockService.update(
      id,
      data
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: block,
  };
}

export async function deleteReservationBlock(
  id: string
) {
  await reservationBlockService.delete(
    id
  );

  revalidateReservationPaths();

  return {
    success: true,
  };
}

export async function activateReservationBlock(
  id: string
) {
  const block =
    await reservationBlockService.activate(
      id
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: block,
  };
}

export async function deactivateReservationBlock(
  id: string
) {
  const block =
    await reservationBlockService.deactivate(
      id
    );

  revalidateReservationPaths();

  return {
    success: true,
    data: block,
  };
}

export async function getReservationBlock(
  id: string
) {
  return reservationBlockService.getById(
    id
  );
}

export async function getReservationBlocks(
  restaurantId: string,
  options?: {
    activeOnly?: boolean;
    from?: string;
    to?: string;
  }
) {
  return reservationBlockService.listByRestaurant(
    restaurantId,
    options
  );
}

export async function canCreateReservationBlock(
  restaurantId: string,
  startAt: string,
  endAt: string,
  tableId?: string | null,
  affectsAllTables = true
) {
  const available =
    await reservationBlockService.canCreateBlock(
      restaurantId,
      startAt,
      endAt,
      tableId,
      affectsAllTables
    );

  return {
    success: true,
    available,
  };
}

/* =========================================================
 * ANTICIPOS / PAGOS DE RESERVAS
 * ======================================================= */

export async function getReservationDepositSettings(
  restaurantId: string
) {
  return getDepositSettingsAction(restaurantId);
}

export async function updateReservationDepositSettings(
  restaurantId: string,
  input: ReservationDepositSettingsInput
) {
  return updateDepositSettingsAction(
    restaurantId,
    input
  );
}

export async function createReservationDeposit(
  reservationId: string,
  restaurantId: string,
  method: ReservationDepositPaymentMethod
) {
  return createDepositAction(
    reservationId,
    restaurantId,
    method
  );
}

export async function markReservationDepositPaid(
  depositId: string,
  proofUrl?: string | null
) {
  return markDepositPaidAction(
    depositId,
    proofUrl
  );
}