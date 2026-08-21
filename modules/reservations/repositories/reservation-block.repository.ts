import { supabaseAdmin } from "@/lib/supabase/supabase";

export type ReservationBlockType =
  | "schedule"
  | "event"
  | "closure"
  | "maintenance"
  | "private"
  | "other";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface CreateReservationBlockInput {
  restaurantId: string;
  tableId?: string | null;
  title: string;
  description?: string | null;
  blockType?: ReservationBlockType;
  startAt: string;
  endAt: string;
  affectsAllTables?: boolean;
  active?: boolean;
  color?: string | null;
  metadata?: Json;
}

export interface UpdateReservationBlockInput {
  tableId?: string | null;
  title?: string;
  description?: string | null;
  blockType?: ReservationBlockType;
  startAt?: string;
  endAt?: string;
  affectsAllTables?: boolean;
  active?: boolean;
  color?: string | null;
  metadata?: Json;
}

export interface ReservationBlock {
  id: string;
  restaurant_id: string;
  table_id: string | null;
  title: string;
  description: string | null;
  block_type: string;
  start_at: string;
  end_at: string;
  affects_all_tables: boolean;
  active: boolean;
  color: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export class ReservationBlockRepository {
  async create(
    input: CreateReservationBlockInput
  ): Promise<ReservationBlock> {
    this.validateInterval(
      input.startAt,
      input.endAt
    );

    const affectsAllTables =
      input.affectsAllTables ?? true;

    if (
      !affectsAllTables &&
      !input.tableId
    ) {
      throw new Error(
        "TABLE_ID_REQUIRED_FOR_TABLE_BLOCK"
      );
    }

    const { data, error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .insert({
          restaurant_id:
            input.restaurantId,

          table_id: affectsAllTables
            ? null
            : input.tableId ?? null,

          title: input.title,

          description:
            input.description ?? null,

          block_type:
            input.blockType ?? "schedule",

          start_at: input.startAt,

          end_at: input.endAt,

          affects_all_tables:
            affectsAllTables,

          active:
            input.active ?? true,

          color:
            input.color ?? null,

          metadata:
            input.metadata ?? {},
        })
        .select()
        .single();

    if (error) {
      console.error(
        "CREATE RESERVATION BLOCK ERROR",
        error
      );

      throw error;
    }

    return data as ReservationBlock;
  }

  async update(
    id: string,
    input: UpdateReservationBlockInput
  ): Promise<ReservationBlock> {
    if (
      input.startAt &&
      input.endAt
    ) {
      this.validateInterval(
        input.startAt,
        input.endAt
      );
    }

    if (
      input.affectsAllTables === false &&
      input.tableId === undefined
    ) {
      throw new Error(
        "TABLE_ID_REQUIRED_FOR_TABLE_BLOCK"
      );
    }

const payload: {
  table_id?: string | null;
  title?: string;
  description?: string | null;
  block_type?: string;
  start_at?: string;
  end_at?: string;
  affects_all_tables?: boolean;
  active?: boolean;
  color?: string | null;
  metadata?: Json;
} = {};

    if (
      input.tableId !== undefined
    ) {
      payload.table_id =
        input.affectsAllTables === true
          ? null
          : input.tableId;
    }

    if (
      input.title !== undefined
    ) {
      payload.title = input.title;
    }

    if (
      input.description !== undefined
    ) {
      payload.description =
        input.description;
    }

    if (
      input.blockType !== undefined
    ) {
      payload.block_type =
        input.blockType;
    }

    if (
      input.startAt !== undefined
    ) {
      payload.start_at =
        input.startAt;
    }

    if (
      input.endAt !== undefined
    ) {
      payload.end_at =
        input.endAt;
    }

    if (
      input.affectsAllTables !== undefined
    ) {
      payload.affects_all_tables =
        input.affectsAllTables;
    }

    if (
      input.active !== undefined
    ) {
      payload.active =
        input.active;
    }

    if (
      input.color !== undefined
    ) {
      payload.color =
        input.color;
    }

    if (
      input.metadata !== undefined
    ) {
      payload.metadata =
        input.metadata;
    }

    const { data, error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "UPDATE RESERVATION BLOCK ERROR",
        error
      );

      throw error;
    }

    return data as ReservationBlock;
  }

  async delete(
    id: string
  ): Promise<void> {
    const { error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "DELETE RESERVATION BLOCK ERROR",
        error
      );

      throw error;
    }
  }

  async setActive(
    id: string,
    active: boolean
  ): Promise<ReservationBlock> {
    const { data, error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .update({
          active,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "SET RESERVATION BLOCK ACTIVE ERROR",
        error
      );

      throw error;
    }

    return data as ReservationBlock;
  }

  async getById(
    id: string
  ): Promise<ReservationBlock | null> {
    const { data, error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
      console.error(
        "GET RESERVATION BLOCK ERROR",
        error
      );

      throw error;
    }

    return data as ReservationBlock | null;
  }

  async listByRestaurant(
    restaurantId: string,
    options?: {
      activeOnly?: boolean;
      from?: string;
      to?: string;
    }
  ): Promise<ReservationBlock[]> {
    let query =
      supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .select("*")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("start_at", {
          ascending: true,
        });

    if (
      options?.activeOnly
    ) {
      query = query.eq(
        "active",
        true
      );
    }

    if (options?.from) {
      query = query.gte(
        "end_at",
        options.from
      );
    }

    if (options?.to) {
      query = query.lte(
        "start_at",
        options.to
      );
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(
        "LIST RESERVATION BLOCKS ERROR",
        error
      );

      throw error;
    }

    return (data ??
      []) as ReservationBlock[];
  }

  async hasConflict(
    restaurantId: string,
    startAt: string,
    endAt: string,
    tableId?: string | null,
    excludeBlockId?: string
  ): Promise<boolean> {
    this.validateInterval(
      startAt,
      endAt
    );

    const { data, error } =
      await supabaseAdmin
        .from(
          "restaurant_reservation_blocks"
        )
        .select(
          "id, table_id, affects_all_tables"
        )
        .eq(
          "restaurant_id",
          restaurantId
        )
        .eq("active", true)
        .lt("start_at", endAt)
        .gt("end_at", startAt);

    if (error) {
      console.error(
        "CHECK RESERVATION BLOCK CONFLICT ERROR",
        error
      );

      throw error;
    }

    const blocks =
      data ?? [];

    return blocks.some(
      (block) => {
        if (
          excludeBlockId &&
          block.id === excludeBlockId
        ) {
          return false;
        }

        if (
          block.affects_all_tables
        ) {
          return true;
        }

        if (!tableId) {
          return false;
        }

        return (
          block.table_id ===
          tableId
        );
      }
    );
  }

  private validateInterval(
    startAt: string,
    endAt: string
  ): void {
    const start =
      new Date(startAt);

    const end =
      new Date(endAt);

    if (
      Number.isNaN(
        start.getTime()
      ) ||
      Number.isNaN(
        end.getTime()
      )
    ) {
      throw new Error(
        "INVALID_BLOCK_DATETIME"
      );
    }

    if (
      end.getTime() <=
      start.getTime()
    ) {
      throw new Error(
        "INVALID_BLOCK_INTERVAL"
      );
    }
  }
}

export const reservationBlockRepository =
  new ReservationBlockRepository();