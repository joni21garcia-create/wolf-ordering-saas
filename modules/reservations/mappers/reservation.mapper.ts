import type { Reservation } from "@/types/reservations";

export function mapRestaurantReservation(row: any): Reservation {
  const primaryAssignment =
    row.restaurant_table_assignments?.find(
      (item: any) => item.is_primary
    ) ??
    row.restaurant_table_assignments?.[0];

  const table =
    primaryAssignment?.restaurant_tables;

  return {
    id: row.id,

    restaurantId:
      row.restaurant_id,

    slug:
      row.slug ?? "",

    confirmationCode:
      row.confirmation_code ?? "",

    status:
      row.status,

    guest: {
      firstName:
        row.customer_name ?? "",

      fullName:
        row.customer_name ?? "",

      lastName:
        undefined,

      phone:
        row.customer_phone ?? "",

      email:
        row.customer_email ?? "",

      document:
        undefined,

      notes:
        row.customer_notes ??
        row.notes ??
        undefined,
    },

    datetime: {
      date:
        row.reservation_date ??
        row.start_at?.substring(0, 10) ??
        "",

      startTime:
        row.start_time ??
        row.start_at ??
        "",

      endTime:
        row.end_time ??
        row.end_at ??
        "",

      timezone:
        row.timezone ??
        "America/Guayaquil",

      durationMinutes:
        row.start_at && row.end_at
          ? Math.round(
              (
                new Date(row.end_at).getTime() -
                new Date(row.start_at).getTime()
              ) / 60000
            )
          : 0,
    },

    capacity: {
      guests:
        row.guests ?? 1,

      adults:
        row.guests ?? 1,

      children:
        0,

      babies:
        0,

      occupiesCapacity:
        row.guests ?? 1,
    },

 assignment:
  primaryAssignment
    ? {
        automatic: true,
        tables: row.restaurant_table_assignments
          ?.map((item: any) => {
            const assignedTable =
              item?.restaurant_tables;

            if (!assignedTable?.id) {
              return null;
            }

            return {
              id: assignedTable.id,
              name:
                assignedTable.name ??
                assignedTable.code ??
                "",
              zone:
                assignedTable.area ??
                undefined,
              capacity:
                Number(
                  assignedTable.capacity ?? 0
                ),
            };
          })
          .filter(Boolean) ?? [],
        totalCapacity:
          row.restaurant_table_assignments
            ?.reduce(
              (
                total: number,
                item: any
              ) =>
                total +
                Number(
                  item?.restaurant_tables
                    ?.capacity ?? 0
                ),
              0
            ) ?? 0,
        assignedAt:
          primaryAssignment.assigned_at,
      }
    : undefined,

    typeId:
      row.metadata?.reservation_type_id ??
      undefined,

    typeName:
      row.type_name ??
      row.metadata?.reservation_type_name ??
      row.occasion ??
      undefined,

    serviceId:
      row.metadata?.service_id ??
      undefined,

    serviceName:
      row.service_name ??
      row.metadata?.service_name ??
      undefined,

    services:
      [],

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
      checked:
        Boolean(row.checked_in_at),
    },

    cancellation:
      undefined,

    history:
      [],

    internalNotes:
      row.internal_notes,

customerNotes:
  row.customer_notes ??
  row.notes ??
  undefined,

    audit: {
      createdAt:
        row.created_at,

      updatedAt:
        row.updated_at,

      createdBy:
        row.created_by,

      updatedBy:
        row.updated_by,
    },
  };
}