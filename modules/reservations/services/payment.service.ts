import {
  paymentRepository,
  type ReservationDeposit,
  type ReservationDepositMethod,
  type ReservationDepositStatus,
} from "../repositories/payment.repository";

export interface CreateReservationDepositInput {
  reservationId: string;
  restaurantId: string;
  amount: number;
  currency?: string;
  method: ReservationDepositMethod;
  paypalOrderId?: string | null;
  notes?: string | null;
}

export interface ReservationDepositResult {
  success: boolean;
  data?: ReservationDeposit;
  message?: string;
}

export class PaymentService {
  async createDeposit(
    input: CreateReservationDepositInput
  ): Promise<ReservationDepositResult> {
    try {
      const deposit = await paymentRepository.create(input);

      return {
        success: true,
        data: deposit,
      };
    } catch (error) {
      console.error("[RESERVATION PAYMENT] CREATE DEPOSIT", error);

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "No se pudo crear el anticipo.",
      };
    }
  }

  async getDeposit(
    depositId: string
  ): Promise<ReservationDeposit | null> {
    return paymentRepository.findById(depositId);
  }

  async getDepositByReservation(
    reservationId: string
  ): Promise<ReservationDeposit | null> {
    return paymentRepository.findByReservation(reservationId);
  }

  async updateDepositStatus(
    depositId: string,
    status: ReservationDepositStatus
  ): Promise<ReservationDeposit> {
    return paymentRepository.updateStatus(depositId, status);
  }

  async markAsPaid(
    depositId: string
  ): Promise<ReservationDeposit> {
    return this.updateDepositStatus(depositId, "paid");
  }

  async markAsFailed(
    depositId: string
  ): Promise<ReservationDeposit> {
    return this.updateDepositStatus(depositId, "failed");
  }

  async markAsRefunded(
    depositId: string
  ): Promise<ReservationDeposit> {
    return this.updateDepositStatus(depositId, "refunded");
  }

  async cancelDeposit(
    depositId: string
  ): Promise<ReservationDeposit> {
    return this.updateDepositStatus(depositId, "cancelled");
  }

  async attachPayPalOrder(
    depositId: string,
    paypalOrderId: string
  ): Promise<ReservationDeposit> {
    return paymentRepository.setPayPalOrderId(
      depositId,
      paypalOrderId
    );
  }
}

export const paymentService = new PaymentService();