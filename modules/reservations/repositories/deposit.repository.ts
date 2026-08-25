import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

function getAdminClient() {
  if (
    !SUPABASE_URL ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Faltan las variables de Supabase para depósitos de reservas.",
    );
  }

  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

export type ReservationDepositPaymentMethod =
  | "cash"
  | "transfer";

export type ReservationDepositStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type ReservationDepositSettings = {
  id: string;
  restaurant_id: string;
  enabled: boolean;
  amount: number;
  currency: "USD";
  allow_cash: boolean;
  allow_transfer: boolean;

  qr_image_url: string | null;
  transfer_instructions: string | null;

  bank_name: string | null;
  bank_account_type:
    | "checking"
    | "savings"
    | null;
  bank_account_number: string | null;
  bank_account_holder: string | null;
  bank_account_document: string | null;

  created_at: string;
  updated_at: string;
};

export type ReservationDepositSettingsInput = {
  enabled?: boolean;
  amount?: number;
  currency?: "USD";
  allow_cash?: boolean;
  allow_transfer?: boolean;

  qr_image_url?: string | null;
  transfer_instructions?: string | null;

  bank_name?: string | null;
  bank_account_type?:
    | "checking"
    | "savings"
    | null;
  bank_account_number?: string | null;
  bank_account_holder?: string | null;
  bank_account_document?: string | null;
};

export type ReservationDeposit = {
  id: string;
  reservation_id: string;
  restaurant_id: string;
  amount: number;
  currency: "USD";
  payment_method: ReservationDepositPaymentMethod;
  status: ReservationDepositStatus;
  proof_url: string | null;

  // Se conserva para no romper registros históricos.
  paypal_order_id: string | null;

  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export const reservationDepositRepository = {
  async getSettings(
    restaurantId: string,
  ): Promise<ReservationDepositSettings> {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("reservation_deposit_settings")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data as ReservationDepositSettings;
    }

    const {
      data: created,
      error: createError,
    } = await supabase
      .from("reservation_deposit_settings")
      .insert({
        restaurant_id: restaurantId,
      })
      .select("*")
      .single();

    if (createError) {
      throw createError;
    }

    return created as ReservationDepositSettings;
  },

  async updateSettings(
    restaurantId: string,
    input: ReservationDepositSettingsInput,
  ): Promise<ReservationDepositSettings> {
    const current =
      await this.getSettings(restaurantId);

    const amount =
      input.amount === undefined
        ? current.amount
        : Number(input.amount);

    if (
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      throw new Error(
        "El monto del anticipo debe ser un número mayor o igual a 0.",
      );
    }

    if (
      input.enabled &&
      amount <= 0
    ) {
      throw new Error(
        "Para activar el anticipo debes indicar un monto mayor que 0.",
      );
    }

    const next = {
      ...current,
      ...input,

      amount,

      currency: "USD" as const,

      qr_image_url:
        input.qr_image_url === undefined
          ? current.qr_image_url
          : input.qr_image_url?.trim() ||
            null,

      transfer_instructions:
        input.transfer_instructions ===
        undefined
          ? current.transfer_instructions
          : input.transfer_instructions?.trim() ||
            null,

      bank_name:
        input.bank_name === undefined
          ? current.bank_name
          : input.bank_name?.trim() ||
            null,

      bank_account_type:
        input.bank_account_type ===
        undefined
          ? current.bank_account_type
          : input.bank_account_type ??
            null,

      bank_account_number:
        input.bank_account_number ===
        undefined
          ? current.bank_account_number
          : input.bank_account_number?.trim() ||
            null,

      bank_account_holder:
        input.bank_account_holder ===
        undefined
          ? current.bank_account_holder
          : input.bank_account_holder?.trim() ||
            null,

      bank_account_document:
        input.bank_account_document ===
        undefined
          ? current.bank_account_document
          : input.bank_account_document?.trim() ||
            null,
    };

    if (
      next.enabled &&
      !next.allow_transfer
    ) {
      throw new Error(
        "Activa la consignación bancaria / QR para habilitar el anticipo.",
      );
    }

    if (
      next.enabled &&
      next.allow_transfer &&
      !next.qr_image_url &&
      !next.transfer_instructions
    ) {
      throw new Error(
        "Para habilitar QR / consignación configura la imagen del QR o las instrucciones de transferencia.",
      );
    }

    const {
      data,
      error,
    } = await getAdminClient()
      .from("reservation_deposit_settings")
      .update({
        enabled: next.enabled,
        amount: next.amount,
        currency: next.currency,
        allow_cash: next.allow_cash,
        allow_transfer: next.allow_transfer,
        qr_image_url: next.qr_image_url,
        transfer_instructions:
          next.transfer_instructions,
        bank_name: next.bank_name,
        bank_account_type:
          next.bank_account_type,
        bank_account_number:
          next.bank_account_number,
        bank_account_holder:
          next.bank_account_holder,
        bank_account_document:
          next.bank_account_document,
      })
      .eq("restaurant_id", restaurantId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ReservationDepositSettings;
  },

  async create(
    reservationId: string,
    restaurantId: string,
    amount: number,
    paymentMethod: ReservationDepositPaymentMethod,
  ): Promise<ReservationDeposit> {
    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "El anticipo debe ser mayor que 0.",
      );
    }

    const supabase =
      getAdminClient();

    const {
      data: reservation,
      error: reservationError,
    } = await supabase
      .from("restaurant_reservations")
      .select(
        "id, restaurant_id",
      )
      .eq("id", reservationId)
      .eq(
        "restaurant_id",
        restaurantId,
      )
      .maybeSingle();

    if (reservationError) {
      throw reservationError;
    }

    if (!reservation) {
      throw new Error(
        "La reserva no existe o no pertenece a este restaurante.",
      );
    }

    const {
      data,
      error,
    } = await supabase
      .from("reservation_deposits")
      .insert({
        reservation_id:
          reservationId,
        restaurant_id:
          restaurantId,
        amount,
        currency: "USD",
        payment_method:
          paymentMethod,
        status: "pending",
      })
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        const {
          data: existing,
          error: existingError,
        } = await supabase
          .from(
            "reservation_deposits",
          )
          .select("*")
          .eq(
            "reservation_id",
            reservationId,
          )
          .single();

        if (existingError) {
          throw existingError;
        }

        return existing as ReservationDeposit;
      }

      throw error;
    }

    return data as ReservationDeposit;
  },

  async markPaid(
    id: string,
    proofUrl?: string | null,
  ) {
    const {
      data,
      error,
    } = await getAdminClient()
      .from("reservation_deposits")
      .update({
        status: "paid",
        proof_url:
          proofUrl?.trim() || null,
        paid_at:
          new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ReservationDeposit;
  },

  async getById(id: string) {
    const {
      data,
      error,
    } = await getAdminClient()
      .from("reservation_deposits")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as ReservationDeposit;
  },
};