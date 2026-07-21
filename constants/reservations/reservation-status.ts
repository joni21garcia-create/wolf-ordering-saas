import { ReservationStatus } from "@/types/reservations";


/* ============================================================================
 * LABELS
 * ========================================================================== */

export const RESERVATION_STATUS_LABELS: Record<
  ReservationStatus,
  string
> = {

  [ReservationStatus.PENDING]:
    "Pendiente",

  [ReservationStatus.CONFIRMED]:
    "Confirmada",

  [ReservationStatus.REJECTED]:
    "Rechazada",

  [ReservationStatus.CANCELLED]:
    "Cancelada",

  [ReservationStatus.CHECKED_IN]:
    "Check-in",

  [ReservationStatus.COMPLETED]:
    "Finalizada",

  [ReservationStatus.NO_SHOW]:
    "No asistió",

  [ReservationStatus.EXPIRED]:
    "Expirada",

};





/* ============================================================================
 * BADGES
 * ========================================================================== */

export const RESERVATION_STATUS_COLORS: Record<
  ReservationStatus,
  string
> = {

  [ReservationStatus.PENDING]:
    "bg-yellow-100 text-yellow-800 border-yellow-200",

  [ReservationStatus.CONFIRMED]:
    "bg-green-100 text-green-800 border-green-200",

  [ReservationStatus.REJECTED]:
    "bg-red-100 text-red-800 border-red-200",

  [ReservationStatus.CANCELLED]:
    "bg-gray-100 text-gray-700 border-gray-200",

  [ReservationStatus.CHECKED_IN]:
    "bg-blue-100 text-blue-800 border-blue-200",

  [ReservationStatus.COMPLETED]:
    "bg-emerald-100 text-emerald-800 border-emerald-200",

  [ReservationStatus.NO_SHOW]:
    "bg-orange-100 text-orange-800 border-orange-200",

  [ReservationStatus.EXPIRED]:
    "bg-slate-100 text-slate-700 border-slate-200",

};





/* ============================================================================
 * ICONOS
 * ========================================================================== */

export const RESERVATION_STATUS_ICONS: Record<
  ReservationStatus,
  string
> = {

  [ReservationStatus.PENDING]:
    "Clock3",

  [ReservationStatus.CONFIRMED]:
    "BadgeCheck",

  [ReservationStatus.REJECTED]:
    "CircleX",

  [ReservationStatus.CANCELLED]:
    "Ban",

  [ReservationStatus.CHECKED_IN]:
    "LogIn",

  [ReservationStatus.COMPLETED]:
    "CheckCircle2",

  [ReservationStatus.NO_SHOW]:
    "UserX",

  [ReservationStatus.EXPIRED]:
    "TimerOff",

};





/* ============================================================================
 * ORDEN UI
 * ========================================================================== */

export const RESERVATION_STATUS_ORDER: ReservationStatus[] = [

  ReservationStatus.PENDING,

  ReservationStatus.CONFIRMED,

  ReservationStatus.CHECKED_IN,

  ReservationStatus.COMPLETED,

  ReservationStatus.NO_SHOW,

  ReservationStatus.CANCELLED,

  ReservationStatus.REJECTED,

  ReservationStatus.EXPIRED,

];





/* ============================================================================
 * ESTADOS FINALES
 * ========================================================================== */

export const RESERVATION_FINAL_STATUSES: ReservationStatus[] = [

  ReservationStatus.COMPLETED,

  ReservationStatus.CANCELLED,

  ReservationStatus.REJECTED,

  ReservationStatus.NO_SHOW,

  ReservationStatus.EXPIRED,

];





/* ============================================================================
 * ESTADOS ACTIVOS
 * ========================================================================== */

export const RESERVATION_ACTIVE_STATUSES: ReservationStatus[] = [

  ReservationStatus.PENDING,

  ReservationStatus.CONFIRMED,

  ReservationStatus.CHECKED_IN,

];





/* ============================================================================
 * TRANSICIONES PERMITIDAS
 * ========================================================================== */

export const RESERVATION_ALLOWED_TRANSITIONS: Record<
 ReservationStatus,
 ReservationStatus[]
> = {


 [ReservationStatus.PENDING]:

 [
  ReservationStatus.CONFIRMED,

  ReservationStatus.REJECTED,

  ReservationStatus.CANCELLED,

 ],




 [ReservationStatus.CONFIRMED]:

 [
  ReservationStatus.CHECKED_IN,

  ReservationStatus.CANCELLED,

  ReservationStatus.NO_SHOW,

 ],




 [ReservationStatus.CHECKED_IN]:

 [
  ReservationStatus.COMPLETED,

 ],




 [ReservationStatus.COMPLETED]:

 [],




 [ReservationStatus.CANCELLED]:

 [],




 [ReservationStatus.REJECTED]:

 [],




 [ReservationStatus.NO_SHOW]:

 [],




 [ReservationStatus.EXPIRED]:

 [],


};

