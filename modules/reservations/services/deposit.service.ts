import {
  reservationDepositRepository,
  type ReservationDepositPaymentMethod,
  type ReservationDepositSettings,
} from "../repositories/deposit.repository";

export class ReservationDepositService {
  async getSettings(restaurantId: string) {
    return reservationDepositRepository.getSettings(restaurantId);
  }

  async updateSettings(
    restaurantId: string,
    input: Parameters<typeof reservationDepositRepository.updateSettings>[1],
  ) {
    return reservationDepositRepository.updateSettings(restaurantId, input);
  }

  async createForReservation(
    reservationId: string,
    restaurantId: string,
    method: ReservationDepositPaymentMethod,
    settings: ReservationDepositSettings,
  ): Promise<Awaited<ReturnType<typeof reservationDepositRepository.create>>> {
    if (!settings.enabled) {
      throw new Error("El anticipo ya no está habilitado para este restaurante.");
    }

    if (settings.amount <= 0) {
      throw new Error("El anticipo está activado pero no tiene un monto válido.");
    }

    const allowed = method === "transfer" && settings.allow_transfer;

    if (!allowed) {
      throw new Error("El método de pago seleccionado no está disponible.");
    }

    return reservationDepositRepository.create(
      reservationId,
      restaurantId,
      settings.amount,
      method,
    );
  }
}

export const reservationDepositService =
  new ReservationDepositService();