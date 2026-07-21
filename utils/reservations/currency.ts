/* ============================================================================
 * CONFIGURACIÓN
 * ========================================================================== */

const DEFAULT_LOCALE = "es-EC";

const DEFAULT_CURRENCY = "USD";

/* ============================================================================
 * MONEDA
 * ========================================================================== */

export function formatCurrency(
  value: number,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/* ============================================================================
 * NÚMERO
 * ========================================================================== */

export function formatNumber(
  value: number,
  locale = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/* ============================================================================
 * PORCENTAJE
 * ========================================================================== */

export function formatPercent(
  value: number,
  decimals = 2,
  locale = DEFAULT_LOCALE
): string {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/* ============================================================================
 * PARSE
 * ========================================================================== */

export function parseCurrency(
  value: string
): number {
  const normalized = value
    .replace(/[^\d.,-]/g, "")
    .replace(",", ".");

  const result = Number(normalized);

  return Number.isNaN(result) ? 0 : result;
}

/* ============================================================================
 * REDONDEAR
 * ========================================================================== */

export function roundCurrency(
  value: number,
  decimals = 2
): number {
  return Number(
    value.toFixed(decimals)
  );
}

/* ============================================================================
 * SUMAR
 * ========================================================================== */

export function sumCurrency(
  values: number[]
): number {
  return roundCurrency(
    values.reduce(
      (total, value) => total + value,
      0
    )
  );
}

/* ============================================================================
 * RESTAR
 * ========================================================================== */

export function subtractCurrency(
  total: number,
  value: number
): number {
  return roundCurrency(total - value);
}

/* ============================================================================
 * PORCENTAJE
 * ========================================================================== */

export function calculatePercentage(
  amount: number,
  percentage: number
): number {
  return roundCurrency(
    amount * (percentage / 100)
  );
}

/* ============================================================================
 * ANTICIPO
 * ========================================================================== */

export function calculateDeposit(
  subtotal: number,
  type: "fixed" | "percentage" | "per_person" | "none",
  value: number,
  guests = 1
): number {
  switch (type) {
    case "fixed":
      return roundCurrency(value);

    case "percentage":
      return calculatePercentage(
        subtotal,
        value
      );

    case "per_person":
      return roundCurrency(
        guests * value
      );

    default:
      return 0;
  }
}


