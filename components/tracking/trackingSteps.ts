/*
==========================================================

Wolf Ordering

Tracking Steps

==========================================================
*/

export interface TrackingStep {

  key: string;

  icon: string;

  short: string;

  field: string;

}

/*
==========================================================
DELIVERY
==========================================================
*/

export const DELIVERY_STEPS: TrackingStep[] = [

  {
    key: "pending",
    icon: "🛎️",
    short: "Rec.",
    field: "created_at",
  },

  {
    key: "accepted",
    icon: "👨‍🍳",
    short: "Acept.",
    field: "accepted_at",
  },

  {
    key: "preparing",
    icon: "🍳",
    short: "Prep.",
    field: "preparing_at",
  },

  {
    key: "ready",
    icon: "📦",
    short: "Listo",
    field: "ready_at",
  },

  {
    key: "out_for_delivery",
    icon: "🛵",
    short: "Camino",
    field: "out_for_delivery_at",
  },

  {
    key: "completed",
    icon: "🎉",
    short: "OK",
    field: "completed_at",
  },

];

/*
==========================================================
PICKUP
==========================================================
*/

export const PICKUP_STEPS: TrackingStep[] = [

  {
    key: "pending",
    icon: "🛎️",
    short: "Rec.",
    field: "created_at",
  },

  {
    key: "accepted",
    icon: "👨‍🍳",
    short: "Acept.",
    field: "accepted_at",
  },

  {
    key: "preparing",
    icon: "🍳",
    short: "Prep.",
    field: "preparing_at",
  },

  {
    key: "ready",
    icon: "🥡",
    short: "Recoger",
    field: "ready_at",
  },

  {
    key: "completed",
    icon: "🎉",
    short: "Ret.",
    field: "completed_at",
  },

];

/*
==========================================================
TABLE
==========================================================
*/

export const TABLE_STEPS: TrackingStep[] = [

  {
    key: "pending",
    icon: "🛎️",
    short: "Rec.",
    field: "created_at",
  },

  {
    key: "accepted",
    icon: "👨‍🍳",
    short: "Acept.",
    field: "accepted_at",
  },

  {
    key: "preparing",
    icon: "🍳",
    short: "Prep.",
    field: "preparing_at",
  },

  {
    key: "ready",
    icon: "🍽️",
    short: "Mesa",
    field: "ready_at",
  },

  {
    key: "completed",
    icon: "🎉",
    short: "Serv.",
    field: "completed_at",
  },

];

/*
==========================================================
HELPER
==========================================================
*/

export function getTrackingSteps(
  orderType?: string
): TrackingStep[] {

  const type = String(orderType ?? "")
    .replace(/"/g, "")
    .trim();

  console.log(
    "[TRACKING] orderType:",
    orderType
  );

  console.log(
    "[TRACKING] NORMALIZADO:",
    type
  );

  switch (type) {

    case "pickup":
      return PICKUP_STEPS;

    case "table":
      return TABLE_STEPS;

    case "delivery":
      return DELIVERY_STEPS;

    default:
      return DELIVERY_STEPS;

  }

}