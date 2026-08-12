import { createBrowserClient } from "@supabase/ssr";

export const WOLF_CUSTOMER_ID_KEY = "wolf_customer_id";

/**
 * Obtiene o crea la identidad anónima estable del cliente Wolf.
 *
 * Usa exactamente la misma clave y formato que CheckoutForm,
 * permitiendo compartir la identidad entre Discover, Direcciones
 * y Checkout sin necesidad de una cuenta.
 */
export function getOrCreateWolfCustomerId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const existing = window.localStorage.getItem(WOLF_CUSTOMER_ID_KEY);

    if (existing?.trim()) {
      return existing.trim();
    }

    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? `wolf_${crypto.randomUUID()}`
        : `wolf_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;

    window.localStorage.setItem(WOLF_CUSTOMER_ID_KEY, id);

    return id;
  } catch {
    return null;
  }
}

function getWolfCustomerId(): string | null {
  return getOrCreateWolfCustomerId();
}

const wolfFetch: typeof fetch = async (input, init) => {
  const customerId = getWolfCustomerId();

  const headers = new Headers(init?.headers);

  if (customerId) {
    headers.set("x-wolf-customer-id", customerId);
  }

  return fetch(input, {
    ...init,
    headers,
  });
};

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: wolfFetch,
    },
  },
);