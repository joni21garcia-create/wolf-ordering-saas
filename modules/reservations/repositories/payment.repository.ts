import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export type ReservationDepositMethod =
  | "cash"
  | "qr"
  | "paypal";

export type ReservationDepositStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export interface CreateReservationDepositInput {
  reservationId: string;
  restaurantId: string;
  amount: number;
  currency?: string;
  method: ReservationDepositMethod;
  paypalOrderId?: string | null;
  notes?: string | null;
}

export interface ReservationDeposit {
  id: string;
  reservation_id: string;
  restaurant_id: string;
  amount: number;
  currency: string;
  method: ReservationDepositMethod;
  status: ReservationDepositStatus;
  paypal_order_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

class PaymentRepository {
  async create(
    input: CreateReservationDepositInput
  ): Promise<ReservationDeposit> {
    if (!input.reservationId) {
      throw new Error("reservationId es obligatorio.");
    }

    if (!input.restaurantId) {
      throw new Error("restaurantId es obligatorio.");
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("El monto del anticipo debe ser mayor que cero.");
    }

    const { data, error } = await supabase
      .from("reservation_deposits")
      .insert({
        reservation_id: input.reservationId,
        restaurant_id: input.restaurantId,
        amount: input.amount,
        currency: input.currency ?? "USD",
        method: input.method,
        status: "pending",
        paypal_order_id: input.paypalOrderId ?? null,
        notes: input.notes ?? null,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[RESERVATION DEPOSIT CREATE]", error);
      throw new Error(
        `No se pudo crear el anticipo: ${error.message}`
      );
    }

    return data as ReservationDeposit;
  }

  async findById(
    depositId: string
  ): Promise<ReservationDeposit | null> {
    const { data, error } = await supabase
      .from("reservation_deposits")
      .select("*")
      .eq("id", depositId)
      .maybeSingle();

    if (error) {
      console.error("[RESERVATION DEPOSIT FIND]", error);
      throw new Error(
        `No se pudo consultar el anticipo: ${error.message}`
      );
    }

    return (data as ReservationDeposit | null) ?? null;
  }

  async findByReservation(
    reservationId: string
  ): Promise<ReservationDeposit | null> {
    const { data, error } = await supabase
      .from("reservation_deposits")
      .select("*")
      .eq("reservation_id", reservationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[RESERVATION DEPOSIT BY RESERVATION]", error);
      throw new Error(
        `No se pudo consultar el anticipo de la reserva: ${error.message}`
      );
    }

    return (data as ReservationDeposit | null) ?? null;
  }

  async updateStatus(
    depositId: string,
    status: ReservationDepositStatus
  ): Promise<ReservationDeposit> {
    const { data, error } = await supabase
      .from("reservation_deposits")
      .update({ status })
      .eq("id", depositId)
      .select("*")
      .single();

    if (error) {
      console.error("[RESERVATION DEPOSIT STATUS]", error);
      throw new Error(
        `No se pudo actualizar el anticipo: ${error.message}`
      );
    }

    return data as ReservationDeposit;
  }

  async setPayPalOrderId(
    depositId: string,
    paypalOrderId: string
  ): Promise<ReservationDeposit> {
    if (!paypalOrderId) {
      throw new Error("paypalOrderId es obligatorio.");
    }

    const { data, error } = await supabase
      .from("reservation_deposits")
      .update({
        paypal_order_id: paypalOrderId,
      })
      .eq("id", depositId)
      .select("*")
      .single();

    if (error) {
      console.error("[RESERVATION DEPOSIT PAYPAL ORDER]", error);
      throw new Error(
        `No se pudo asociar la orden de PayPal: ${error.message}`
      );
    }

    return data as ReservationDeposit;
  }
}

export const paymentRepository = new PaymentRepository();