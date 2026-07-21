export interface ReservationPaymentResult {

  success: boolean;

  paymentId?: string;

  amount: number;

  currency: string;

  status:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  transactionId?: string;

  checkoutUrl?: string;

  message?: string;

}

export class PaymentService {

  /*
    Crear un pago.

    Futuro:
    - Stripe
    - Mercado Pago
    - PayPal
    - Kushki
  */

  async createPayment(

    reservationId: string,

    amount: number,

    currency = "USD"

  ): Promise<ReservationPaymentResult> {

    return {

      success: true,

      paymentId:
        `PAY-${Date.now()}`,

      amount,

      currency,

      status: "pending"

    };

  }

  /*
    Confirmar pago
  */

  async confirmPayment(
    paymentId: string
  ): Promise<boolean> {

    console.log(
      "CONFIRM PAYMENT",
      paymentId
    );

    return true;

  }

  /*
    Cancelar pago
  */

  async cancelPayment(
    paymentId: string
  ): Promise<boolean> {

    console.log(
      "CANCEL PAYMENT",
      paymentId
    );

    return true;

  }

  /*
    Reembolso
  */

  async refundPayment(

    paymentId: string,

    amount?: number

  ): Promise<boolean> {

    console.log(
      "REFUND PAYMENT",
      paymentId,
      amount
    );

    return true;

  }

  /*
    Consultar estado
  */

  async getPaymentStatus(
    paymentId: string
  ): Promise<ReservationPaymentResult> {

    return {

      success: true,

      paymentId,

      amount: 0,

      currency: "USD",

      status: "paid"

    };

  }

}

export const paymentService =
  new PaymentService();

