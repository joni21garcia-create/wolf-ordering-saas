import type { Reservation } from "@/types/reservations";

export function mapRestaurantReservation(row: any): Reservation {
  return {
    id: row.id,

    restaurantId: row.restaurant_id,

    slug: row.slug ?? "",

    confirmationCode: row.confirmation_code ?? "",

    status: row.status,

    guest: {
      firstName: row.customer_name ?? "",
      fullName: row.customer_name ?? "",
      lastName: undefined,
      phone: row.customer_phone ?? "",
      email: row.customer_email ?? "",
      document: undefined,
      notes: undefined,
    },

    datetime: {
      date: row.start_at?.substring(0,10) ?? "",
      startTime: row.start_at,
      endTime: row.end_at,
      timezone: "America/Guayaquil",
      durationMinutes:
        row.start_at && row.end_at
          ? Math.round(
              (new Date(row.end_at).getTime() -
                new Date(row.start_at).getTime()) / 60000
            )
          : 0,
    },

    capacity: {
      guests: row.guests ?? 1,
      adults: row.guests ?? 1,
      children: 0,
      babies: 0,
      occupiesCapacity: row.guests ?? 1,
    },

    assignment: undefined,

    typeId: row.type_id,

    typeName: row.type_name,

    services: [],

    payment: {
      subtotal: 0,
      servicesTotal: 0,
      depositTotal: 0,
      total: 0,
      currency: "USD",
    },

    deposit: {
      enabled: false,
      paid: false,
      amount: 0,
      currency: "USD",
    },

    commission: {
      enabled: false,
      percentage: 0,
      amount: 0,
      currency: "USD",
    },

    checkIn: {
      checked: false,
    },

    cancellation: undefined,

    history: [],

    internalNotes: row.internal_notes,

    customerNotes: row.customer_notes,

    audit: {
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      updatedBy: row.updated_by,
    },
  };
}
