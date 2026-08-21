import {
  reservationBlockRepository,
  type CreateReservationBlockInput,
  type ReservationBlock,
  type UpdateReservationBlockInput,
} from "../repositories/reservation-block.repository";

export class ReservationBlockService {
  async create(
    input: CreateReservationBlockInput
  ): Promise<ReservationBlock> {
    this.validateInput(input);

    const hasConflict =
      await reservationBlockRepository.hasConflict(
        input.restaurantId,
        input.startAt,
        input.endAt,
        input.affectsAllTables
          ? null
          : input.tableId
      );

    if (hasConflict) {
      throw new Error(
        "RESERVATION_BLOCK_CONFLICT"
      );
    }

    return reservationBlockRepository.create(
      input
    );
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

    const existing =
      await reservationBlockRepository.getById(
        id
      );

    if (!existing) {
      throw new Error(
        "RESERVATION_BLOCK_NOT_FOUND"
      );
    }

    const startAt =
      input.startAt ??
      existing.start_at;

    const endAt =
      input.endAt ??
      existing.end_at;

    const affectsAllTables =
      input.affectsAllTables ??
      existing.affects_all_tables;

    const tableId =
      input.tableId !== undefined
        ? input.tableId
        : existing.table_id;

    const hasConflict =
      await reservationBlockRepository.hasConflict(
        existing.restaurant_id,
        startAt,
        endAt,
        affectsAllTables
          ? null
          : tableId,
        id
      );

    if (hasConflict) {
      throw new Error(
        "RESERVATION_BLOCK_CONFLICT"
      );
    }

    return reservationBlockRepository.update(
      id,
      input
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    const existing =
      await reservationBlockRepository.getById(
        id
      );

    if (!existing) {
      throw new Error(
        "RESERVATION_BLOCK_NOT_FOUND"
      );
    }

    await reservationBlockRepository.delete(
      id
    );
  }

  async activate(
    id: string
  ): Promise<ReservationBlock> {
    return this.setActive(id, true);
  }

  async deactivate(
    id: string
  ): Promise<ReservationBlock> {
    return this.setActive(id, false);
  }

  async setActive(
    id: string,
    active: boolean
  ): Promise<ReservationBlock> {
    const existing =
      await reservationBlockRepository.getById(
        id
      );

    if (!existing) {
      throw new Error(
        "RESERVATION_BLOCK_NOT_FOUND"
      );
    }

    if (
      active &&
      existing.active
    ) {
      return existing;
    }

    if (
      active &&
      !existing.active
    ) {
      const hasConflict =
        await reservationBlockRepository.hasConflict(
          existing.restaurant_id,
          existing.start_at,
          existing.end_at,
          existing.affects_all_tables
            ? null
            : existing.table_id,
          existing.id
        );

      if (hasConflict) {
        throw new Error(
          "RESERVATION_BLOCK_CONFLICT"
        );
      }
    }

    return reservationBlockRepository.setActive(
      id,
      active
    );
  }

  async getById(
    id: string
  ): Promise<ReservationBlock | null> {
    return reservationBlockRepository.getById(
      id
    );
  }

  async listByRestaurant(
    restaurantId: string,
    options?: {
      activeOnly?: boolean;
      from?: string;
      to?: string;
    }
  ): Promise<ReservationBlock[]> {
    if (!restaurantId) {
      throw new Error(
        "RESTAURANT_ID_REQUIRED"
      );
    }

    return reservationBlockRepository.listByRestaurant(
      restaurantId,
      options
    );
  }

  async canCreateBlock(
    restaurantId: string,
    startAt: string,
    endAt: string,
    tableId?: string | null,
    affectsAllTables = true
  ): Promise<boolean> {
    this.validateInterval(
      startAt,
      endAt
    );

    return !(
      await reservationBlockRepository.hasConflict(
        restaurantId,
        startAt,
        endAt,
        affectsAllTables
          ? null
          : tableId
      )
    );
  }

  private validateInput(
    input: CreateReservationBlockInput
  ): void {
    if (!input.restaurantId) {
      throw new Error(
        "RESTAURANT_ID_REQUIRED"
      );
    }

    if (!input.title?.trim()) {
      throw new Error(
        "BLOCK_TITLE_REQUIRED"
      );
    }

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

export const reservationBlockService =
  new ReservationBlockService();