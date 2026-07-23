import { supabaseAdmin } from "@/lib/supabase/supabase";

export class StatisticsService {
  async getRestaurantStatistics(
    restaurantId: string,
  ) {
    const { data, error } = await supabaseAdmin
      .from("restaurant_reservations")
      .select("status")
      .eq("restaurant_id", restaurantId);

    if (error) throw error;

    const reservations = data ?? [];

    const total = reservations.length;

    const pending =
      reservations.filter(r => r.status === "pending").length;

    const confirmed =
      reservations.filter(r => r.status === "confirmed").length;

    const checkedIn =
      reservations.filter(r => r.status === "checked_in").length;

    const completed =
      reservations.filter(r => r.status === "completed").length;

    const cancelled =
      reservations.filter(r => r.status === "cancelled").length;

    const noShow =
      reservations.filter(r => r.status === "no_show").length;

    return {
      total,
      pending,
      confirmed,
      checkedIn,
      completed,
      cancelled,
      noShow,
      occupancyPercentage: 0,
    };
  }
}

export const statisticsService =
  new StatisticsService();
