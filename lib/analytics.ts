export type WolfAnalyticsEvent =
  | "restaurant_view"
  | "order_started"
  | "order_completed"
  | "reservation_started"
  | "reservation_completed";

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: WolfAnalyticsEvent,
  params: AnalyticsParams = {},
) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(["event", event, params]);
}

export function trackOnce(
  storageKey: string,
  event: WolfAnalyticsEvent,
  params: AnalyticsParams = {},
) {
  if (typeof window === "undefined") return;

  try {
    if (sessionStorage.getItem(storageKey) === "1") return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // If storage is unavailable, still send the event.
  }

  trackEvent(event, params);
}
