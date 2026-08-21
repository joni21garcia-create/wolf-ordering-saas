import { supabaseAdmin } from "@/lib/supabase/supabase";

export type ReservationTable = {
  id: string;
  restaurant_id: string;
  code: string;
  name: string;
  capacity: number;
  min_capacity: number;
  max_capacity: number | null;
  joinable: boolean;
  active: boolean;
  area: string | null;
  notes: string | null;
  shape: string;
  color: string | null;
  position_x: number | null;
  position_y: number | null;
  created_at: string;
  updated_at: string;
};

export type ReservationTableInput = {
  code: string;
  name: string;
  capacity: number;
  min_capacity?: number;
  max_capacity?: number | null;
  joinable?: boolean;
  active?: boolean;
  area?: string | null;
  notes?: string | null;
};

function normalizeInput(input: ReservationTableInput) {
  const code = input.code.trim().toUpperCase();
  const name = input.name.trim();

  const capacity = Number(input.capacity);
  const minCapacity = Number(input.min_capacity ?? 1);

  const maxCapacity =
    input.max_capacity === null || input.max_capacity === undefined
      ? capacity
      : Number(input.max_capacity);

  if (!code) {
    throw new Error("El código de la mesa es obligatorio.");
  }

  if (!name) {
    throw new Error("El nombre de la mesa es obligatorio.");
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new Error(
      "La capacidad debe ser un número entero mayor que 0.",
    );
  }

  if (!Number.isInteger(minCapacity) || minCapacity <= 0) {
    throw new Error(
      "La capacidad mínima debe ser un número entero mayor que 0.",
    );
  }

  if (minCapacity > capacity) {
    throw new Error(
      "La capacidad mínima no puede superar la capacidad de la mesa.",
    );
  }

  if (!Number.isInteger(maxCapacity) || maxCapacity < capacity) {
    throw new Error(
      "La capacidad máxima debe ser igual o mayor que la capacidad.",
    );
  }

  return {
    code,
    name,
    capacity,
    min_capacity: minCapacity,
    max_capacity: maxCapacity,
    joinable: input.joinable ?? true,
    active: input.active ?? true,
    area: input.area?.trim() || null,
    notes: input.notes?.trim() || null,
  };
}

export class TableSettingsRepository {
  async list(restaurantId: string): Promise<ReservationTable[]> {
    if (!restaurantId) {
      throw new Error("RESTAURANT_ID_REQUIRED");
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("active", { ascending: false })
      .order("capacity", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as ReservationTable[];
  }

  async create(
    restaurantId: string,
    input: ReservationTableInput,
  ): Promise<ReservationTable> {
    if (!restaurantId) {
      throw new Error("RESTAURANT_ID_REQUIRED");
    }

    const payload = normalizeInput(input);

    const { data: duplicate, error: duplicateError } =
      await supabaseAdmin
        .from("restaurant_tables")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("code", payload.code)
        .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (duplicate) {
      throw new Error(
        `Ya existe una mesa con el código ${payload.code}.`,
      );
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .insert({
        restaurant_id: restaurantId,
        ...payload,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ReservationTable;
  }

  async update(
    restaurantId: string,
    id: string,
    input: ReservationTableInput,
  ): Promise<ReservationTable> {
    if (!restaurantId) {
      throw new Error("RESTAURANT_ID_REQUIRED");
    }

    if (!id) {
      throw new Error("TABLE_ID_REQUIRED");
    }

    const payload = normalizeInput(input);

    const { data: duplicate, error: duplicateError } =
      await supabaseAdmin
        .from("restaurant_tables")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("code", payload.code)
        .neq("id", id)
        .maybeSingle();

    if (duplicateError) {
      throw duplicateError;
    }

    if (duplicate) {
      throw new Error(
        `Ya existe otra mesa con el código ${payload.code}.`,
      );
    }

    const { data, error } = await supabaseAdmin
      .from("restaurant_tables")
      .update(payload)
      .eq("restaurant_id", restaurantId)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ReservationTable;
  }

  async remove(
    restaurantId: string,
    id: string,
  ): Promise<void> {
    if (!restaurantId) {
      throw new Error("RESTAURANT_ID_REQUIRED");
    }

    if (!id) {
      throw new Error("TABLE_ID_REQUIRED");
    }

    const { count, error: countError } =
      await supabaseAdmin
        .from("restaurant_table_assignments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("table_id", id);

    if (countError) {
      throw countError;
    }

    if ((count ?? 0) > 0) {
      throw new Error(
        "Esta mesa ya tiene historial de reservas. " +
          "Desactívala en lugar de eliminarla.",
      );
    }

    const { error } = await supabaseAdmin
      .from("restaurant_tables")
      .delete()
      .eq("restaurant_id", restaurantId)
      .eq("id", id);

    if (error) {
      throw error;
    }
  }
}

export const tableSettingsRepository =
  new TableSettingsRepository();