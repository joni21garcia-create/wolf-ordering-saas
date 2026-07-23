"use server";

import { revalidatePath } from "next/cache";

export async function confirmReservation(id: string) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}

export async function cancelReservation(id: string) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}

export async function checkinReservation(id: string) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}

export async function completeReservation(id: string) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}

export async function noShowReservation(id: string) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}

export async function createReservation(data: unknown) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}


export async function getReservation(id: string) {

  return {
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    reservation_date: "",
    start_time: "",
    end_time: "",
    guests: 1,
    internal_notes: "",
  };
}


export async function updateReservation(
  id: string,
  data: unknown
) {

  revalidatePath("/admin/reservations");

  return {
    success: true,
  };
}


export async function getReservationStatistics(
  restaurantId?: string
) {

  return {
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  };
}
