import {
  availabilityRepository
} from "../repositories";

export class AvailabilityService {

  async getAvailability(
    restaurantId: string,
    date: string
  ) {

    const start = `${date}T00:00:00`;
    const end = `${date}T23:59:59`;

    const result =
      await availabilityRepository.checkAvailability(
        restaurantId,
        start,
        end,
        0
      );

    return result.tables.map(
      table => ({
        ...table,
        available: true
      })
    );

  }

  async checkAvailability(
    restaurantId: string,
    start: string,
    end: string,
    guests: number
  ) {

    return availabilityRepository.checkAvailability(
      restaurantId,
      start,
      end,
      guests
    );

  }

  async getAvailableTables(
    restaurantId: string,
    start: string,
    end: string,
    guests: number
  ) {

    const availability =
      await this.checkAvailability(
        restaurantId,
        start,
        end,
        guests
      );

    return availability.tables;

  }

}

export const availabilityService =
  new AvailabilityService();
