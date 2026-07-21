/**
 * ============================================================================
 * Fecha y Hora
 * ============================================================================
 */

export function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function today(): Date {
  return new Date();
}

export function nowISO(): string {
  return new Date().toISOString();
}

/**
 * ============================================================================
 * Comparaciones
 * ============================================================================
 */

export function isSameDay(a: Date | string, b: Date | string): boolean {
  const dateA = toDate(a);
  const dateB = toDate(b);

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function isToday(date: Date | string): boolean {
  return isSameDay(date, today());
}

export function isPast(date: Date | string): boolean {
  return toDate(date).getTime() < Date.now();
}

export function isFuture(date: Date | string): boolean {
  return toDate(date).getTime() > Date.now();
}

/**
 * ============================================================================
 * Formato
 * ============================================================================
 */

export function formatDate(date: Date | string): string {
  return toDate(date).toLocaleDateString();
}

export function formatTime(date: Date | string): string {
  return toDate(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * ============================================================================
 * Manipulación
 * ============================================================================
 */

export function addMinutes(
  date: Date | string,
  minutes: number
): Date {
  return new Date(toDate(date).getTime() + minutes * 60000);
}

export function addHours(
  date: Date | string,
  hours: number
): Date {
  return addMinutes(date, hours * 60);
}

export function addDays(
  date: Date | string,
  days: number
): Date {
  const result = new Date(toDate(date));

  result.setDate(result.getDate() + days);

  return result;
}

/**
 * ============================================================================
 * Diferencias
 * ============================================================================
 */

export function diffMinutes(
  start: Date | string,
  end: Date | string
): number {
  return Math.floor(
    (toDate(end).getTime() - toDate(start).getTime()) / 60000
  );
}

export function diffHours(
  start: Date | string,
  end: Date | string
): number {
  return diffMinutes(start, end) / 60;
}

/**
 * ============================================================================
 * Rangos
 * ============================================================================
 */

export function isBetween(
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean {
  const value = toDate(date).getTime();

  return (
    value >= toDate(start).getTime() &&
    value <= toDate(end).getTime()
  );
}

/**
 * ============================================================================
 * Inicio y Fin del día
 * ============================================================================
 */

export function startOfDay(date: Date | string): Date {
  const result = toDate(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

export function endOfDay(date: Date | string): Date {
  const result = toDate(date);

  result.setHours(23, 59, 59, 999);

  return result;
}


