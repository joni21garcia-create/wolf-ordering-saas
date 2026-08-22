"use client";

import * as React from "react";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  StickyNote,
  Tag,
  Users,
  X,
  Search,
  SlidersHorizontal,
  Download,
} from "lucide-react";

import {
  ReservationStatus,
  type Reservation,
} from "@/types/reservations";

import { WolfSheet } from "@/lib/wolf-ui";

import { ReservationTableHeader } from "./ReservationTableHeader";
import { ReservationTableRow } from "./ReservationTableRow";

import { ReservationActions } from "../../../modules/reservations/components/reservation-actions";

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";

interface ReservationTableProps {
  reservations: Reservation[];
  loading?: boolean;
  onRefresh?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  checked_in: "Check-in",
  completed: "Finalizada",
  cancelled: "Cancelada",
  no_show: "No Show",
};

const FILTERS: Array<{ key: string; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "confirmed", label: "Confirmadas" },
  { key: "checked_in", label: "Check-in" },
  { key: "cancelled", label: "Canceladas" },
  { key: "no_show", label: "No-show" },
  { key: "completed", label: "Finalizadas" },
];

const STATUS_STYLES: Record<
  string,
  { dot: string; bg: string; text: string }
> = {
  pending: {
    dot: "#FACC15",
    bg: "rgba(250,204,21,.12)",
    text: "#CA8A04",
  },
  confirmed: {
    dot: "#22C55E",
    bg: "rgba(34,197,94,.12)",
    text: "#16A34A",
  },
  checked_in: {
    dot: "#3B82F6",
    bg: "rgba(59,130,246,.12)",
    text: "#2563EB",
  },
  completed: {
    dot: "#71717A",
    bg: "rgba(113,113,122,.12)",
    text: "#52525B",
  },
  cancelled: {
    dot: "#EF4444",
    bg: "rgba(239,68,68,.12)",
    text: "#DC2626",
  },
  no_show: {
    dot: "#8B5CF6",
    bg: "rgba(139,92,246,.12)",
    text: "#7C3AED",
  },
};

function formatTime(value?: string | null) {
  return value ? value.slice(0, 5) : "--:--";
}

function getDateObject(value?: string | null) {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

function formatDate(value?: string | null) {
  const date = getDateObject(value);

  if (!date) return value || "-";

  return new Intl.DateTimeFormat("es-EC", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function formatLongDate(value?: string | null) {
  const date = getDateObject(value);

  if (!date) return value || "-";

  return new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isToday(value?: string | null) {
  if (!value) return false;

  const today = new Date();
  const date = getDateObject(value);

  if (!date) return false;

  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
}


function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

async function exportReservationsToExcel(
  reservations: Reservation[]
) {
  const headers = [
    "Fecha",
    "Hora inicio",
    "Hora fin",
    "Cliente",
    "Teléfono",
    "Email",
    "Personas",
    "Mesa",
    "Tipo de reserva",
    "Notas",
    "Estado",
    "Código de confirmación",
  ];

  const rows = reservations.map(
    (reservation) => {
      const tables =
        reservation.assignment?.tables
          ?.map((table) => table.name)
          .filter(Boolean)
          .join(", ") ?? "";

      return [
        reservation.datetime?.date ?? "",
        formatTime(
          reservation.datetime?.startTime
        ),
        formatTime(
          reservation.datetime?.endTime
        ),
        reservation.guest?.fullName ?? "",
        reservation.guest?.phone ?? "",
        reservation.guest?.email ?? "",
        reservation.capacity?.guests ?? 0,
        tables,
        reservation.typeName ?? "",
        reservation.customerNotes ?? "",
        STATUS_LABELS[
          String(reservation.status)
        ] ??
          String(
            reservation.status ?? ""
          ),
        reservation.confirmationCode ?? "",
      ];
    }
  );

  /*
   * ============================================================
   * CREAR LIBRO EXCEL REAL (.xlsx)
   * ============================================================
   */

  const XLSX = await import("xlsx");

  const worksheetData = [
    headers,
    ...rows,
  ];

  const worksheet =
    XLSX.utils.aoa_to_sheet(
      worksheetData
    );

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Reservas"
  );

  /*
   * Anchos de columnas para que el Excel
   * quede cómodo de leer.
   */
  worksheet["!cols"] = [
    { wch: 14 },
    { wch: 12 },
    { wch: 12 },
    { wch: 28 },
    { wch: 18 },
    { wch: 30 },
    { wch: 10 },
    { wch: 18 },
    { wch: 22 },
    { wch: 40 },
    { wch: 18 },
    { wch: 24 },
  ];

  /*
   * Fecha del archivo.
   */
  const date =
    new Date()
      .toISOString()
      .slice(0, 10);

  const fileName =
    `reservas-${date}.xlsx`;

  /*
   * ============================================================
   * ANDROID / CAPACITOR
   * ============================================================
   */
  if (Capacitor.isNativePlatform()) {
    try {
      const base64 =
        XLSX.write(workbook, {
          bookType: "xlsx",
          type: "base64",
        });

      const result =
        await Filesystem.writeFile({
          path: fileName,
          data: base64,
          directory:
            Directory.Cache,
          recursive: true,
        });

      await Share.share({
        title: "Exportar reservas",
        text: "Reservas de Wolf Ordering",
        url: result.uri,
        dialogTitle:
          "Guardar o compartir reservas",
      });

      return;
    } catch (error) {
      console.error(
        "EXPORT RESERVATIONS ANDROID ERROR",
        error
      );

      return;
    }
  }

  /*
   * ============================================================
   * WEB
   * ============================================================
   */
  const excelBuffer =
    XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

  const blob = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function getInitials(name?: string | null) {
  const value = name?.trim() || "?";

  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getTableInfo(reservation: Reservation) {
  const tables =
    reservation.assignment?.tables ?? [];

  const names = tables
    .map((table) => table.name)
    .filter(
      (value): value is string =>
        Boolean(value)
    );

  const zones = tables
    .map((table) => table.zone)
    .filter(
      (value): value is string =>
        Boolean(value)
    );

  return {
    name:
      names.length > 0
        ? names.join(", ")
        : "Sin mesa",
    zone:
      zones.length > 0
        ? zones.join(", ")
        : null,
  };
}

function StatusBadge({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const style =
    STATUS_STYLES[status] ??
    STATUS_STYLES.completed;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold"
      style={{
        padding: compact
          ? "4px 8px"
          : "6px 10px",
        background: style.bg,
        color: style.text,
        fontSize: compact ? 10 : 11,
        lineHeight: 1,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: style.dot,
        }}
      />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function MobileReservationItem({
  reservation,
  onOpen,
}: {
  reservation: Reservation;
  onOpen: (
    reservation: Reservation
  ) => void;
}) {
  const table = getTableInfo(reservation);
  const status = String(reservation.status);
  const guests =
    reservation.capacity?.guests ?? 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(reservation)}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        border-b
        border-white/7
        px-4
        py-3
        text-left
        transition
        active:scale-[.995]
        active:bg-white/[.04]
      "
      style={{
        background: "#121212",
        WebkitTapHighlightColor:
          "transparent",
      }}
    >
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-full
          font-bold
          text-white
        "
        style={{
          background:
            "linear-gradient(135deg,#F97316,#EA580C)",
          boxShadow:
            "0 8px 20px rgba(249,115,22,.16)",
        }}
      >
        {getInitials(
          reservation.guest?.fullName
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="min-w-0 flex-1 truncate text-sm font-semibold"
            style={{ color: "#FFFFFF" }}
          >
            {reservation.guest?.fullName ||
              "Sin nombre"}
          </span>

          <StatusBadge
            status={status}
            compact
          />
        </div>

        <div
          className="mt-1.5 flex min-w-0 items-center gap-3 text-xs"
          style={{ color: "#A1A1AA" }}
        >
          <span className="inline-flex items-center gap-1">
            <Clock3 size={13} />
            {formatTime(
              reservation.datetime?.startTime
            )}
          </span>

          <span className="inline-flex items-center gap-1">
            <Users size={13} />
            {guests}
          </span>

          <span className="min-w-0 truncate">
            {table.name}
          </span>
        </div>
      </div>

      <ChevronRight
        size={19}
        className="shrink-0 transition-transform group-active:translate-x-0.5"
        style={{ color: "#71717A" }}
      />
    </button>
  );
}

export function ReservationSheetContent({
  reservation,
  onRefresh,
  onClose,
}: {
  reservation: Reservation;
  onRefresh?: () => void;
  onClose: () => void;
}) {
  const table = getTableInfo(reservation);
  const status = String(reservation.status);
  const guests =
    reservation.capacity?.guests ?? 0;

  return (
    <div
      className="min-h-full px-4 pb-8 pt-2 sm:px-6"
      style={{
        background: "#0D0D0F",
      }}
    >
      <div
        className="mb-5 flex items-start gap-3 rounded-2xl border p-4"
        style={{
          borderColor:
            "rgba(255,255,255,.07)",
          background: "#121212",
        }}
      >
        <div
          className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-full
            text-base
            font-extrabold
            text-white
          "
          style={{
            background:
              "linear-gradient(135deg,#F97316,#EA580C)",
            boxShadow:
              "0 12px 28px rgba(249,115,22,.18)",
          }}
        >
          {getInitials(
            reservation.guest?.fullName
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-white">
            {reservation.guest?.fullName ||
              "Sin nombre"}
          </h3>

          <div className="mt-2">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DetailTile
          icon={<CalendarDays size={17} />}
          label="Fecha"
          value={formatLongDate(
            reservation.datetime?.date
          )}
          accent="#F97316"
        />

        <DetailTile
          icon={<Clock3 size={17} />}
          label="Horario"
          value={`${formatTime(
            reservation.datetime?.startTime
          )} – ${formatTime(
            reservation.datetime?.endTime
          )}`}
          accent="#3B82F6"
        />

        <DetailTile
          icon={<Users size={17} />}
          label="Personas"
          value={`${guests} ${
            guests === 1
              ? "persona"
              : "personas"
          }`}
          accent="#22C55E"
        />

        <DetailTile
          icon={<MapPin size={17} />}
          label="Mesa"
          value={table.name}
          secondary={table.zone ?? undefined}
          accent="#F97316"
        />
      </div>

      {reservation.guest?.phone ? (
        <a
          href={`tel:${reservation.guest.phone}`}
          className="mt-2 flex min-h-12 items-center gap-3 rounded-2xl border px-4 transition active:scale-[.99]"
          style={{
            borderColor:
              "rgba(255,255,255,.07)",
            background: "#121212",
            color: "#FFFFFF",
            textDecoration: "none",
          }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background:
                "rgba(139,92,246,.12)",
              color: "#8B5CF6",
            }}
          >
            <Phone size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "#71717A" }}
            >
              Teléfono
            </p>
            <p className="truncate text-sm font-medium">
              {reservation.guest.phone}
            </p>
          </div>
        </a>
      ) : null}

      {(reservation.typeName || reservation.customerNotes) ? (
        <div
          className="mt-2 space-y-3 rounded-2xl border p-4"
          style={{
            borderColor: "rgba(255,255,255,.07)",
            background: "#121212",
          }}
        >
          {reservation.typeName ? (
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(249,115,22,.12)",
                  color: "#F97316",
                }}
              >
                <Tag size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "#71717A" }}
                >
                  Tipo de reserva
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {reservation.typeName}
                </p>
              </div>
            </div>
          ) : null}

          {reservation.customerNotes ? (
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(59,130,246,.12)",
                  color: "#3B82F6",
                }}
              >
                <StickyNote size={17} />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: "#71717A" }}
                >
                  Notas del cliente
                </p>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-5 text-zinc-200">
                  {reservation.customerNotes}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="mt-5 rounded-2xl border p-4"
        style={{
          borderColor:
            "rgba(255,255,255,.07)",
          background: "#121212",
        }}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            Acciones
          </p>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition active:scale-95"
            style={{
              background:
                "rgba(255,255,255,.07)",
              color: "#A1A1AA",
            }}
            aria-label="Cerrar detalle"
          >
            <X size={17} />
          </button>
        </div>

        <ReservationActions
          reservationId={reservation.id}
          status={
            reservation.status as ReservationStatus
          }
          onUpdated={() => {
            onRefresh?.();
            onClose();
          }}
        />
      </div>
    </div>
  );
}

function DetailTile({
  icon,
  label,
  value,
  secondary,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
  accent: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border p-3.5"
      style={{
        borderColor:
          "rgba(255,255,255,.07)",
        background: "#121212",
      }}
    >
      <div
        className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background: `${accent}1F`,
          color: accent,
        }}
      >
        {icon}
      </div>

      <p
        className="text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "#71717A" }}
      >
        {label}
      </p>

      <p
        className="mt-1 truncate text-sm font-semibold"
        style={{ color: "#FFFFFF" }}
      >
        {value}
      </p>

      {secondary ? (
        <p
          className="mt-0.5 truncate text-[11px]"
          style={{ color: "#71717A" }}
        >
          {secondary}
        </p>
      ) : null}
    </div>
  );
}

export function ReservationTable({
  reservations,
  loading = false,
  onRefresh,
}: ReservationTableProps) {
  const [selectedReservation, setSelectedReservation] =
    React.useState<Reservation | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filteredReservations = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const status = String(reservation.status ?? "");
      if (statusFilter !== "all" && status !== statusFilter) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        reservation.guest?.fullName,
        reservation.guest?.phone,
        reservation.guest?.email,
        reservation.confirmationCode,
        reservation.typeName,
        reservation.customerNotes,
        reservation.assignment?.tables?.map((table) => table.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [reservations, search, statusFilter]);

  const groupedReservations = React.useMemo(() => {
    const groups = new Map<
      string,
      Reservation[]
    >();

    const sorted = [...filteredReservations].sort(
      (a, b) => {
        const aKey = `${a.datetime?.date ?? ""} ${
          a.datetime?.startTime ?? ""
        }`;

        const bKey = `${b.datetime?.date ?? ""} ${
          b.datetime?.startTime ?? ""
        }`;

        return aKey.localeCompare(bKey);
      }
    );

    for (const reservation of sorted) {
      const key =
        reservation.datetime?.date ??
        "sin-fecha";

      const current =
        groups.get(key) ?? [];

      current.push(reservation);
      groups.set(key, current);
    }

    return Array.from(groups.entries());
  }, [filteredReservations]);

  if (loading) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          borderColor:
            "rgba(24,24,27,.08)",
          background: "#FFFFFF",
          color: "#71717A",
        }}
      >
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-2"
          style={{
            borderColor: "#E4E4E7",
            borderTopColor: "#F97316",
          }}
        />
        <p className="mt-3 font-medium">
          Cargando reservas...
        </p>
      </div>
    );
  }

  if (!reservations.length) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{
          borderColor:
            "rgba(24,24,27,.08)",
          background: "#FFFFFF",
          color: "#71717A",
        }}
      >
        No existen reservas registradas.
      </div>
    );
  }

  return (
    <>
      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-extrabold text-zinc-950 sm:text-lg">
              Todas las reservas
            </h2>
            <p className="mt-1 text-xs text-zinc-500 sm:text-sm">
              {filteredReservations.length} de {reservations.length} reservas
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <button
              type="button"
              onClick={() => exportReservationsToExcel(filteredReservations)}
              disabled={filteredReservations.length === 0}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-bold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
              title="Exportar las reservas visibles a Excel"
            >
              <Download className="h-4 w-4 text-orange-500" />
              Exportar Excel
            </button>

            <label className="relative block w-full lg:w-80">
            <span className="sr-only">Buscar reserva</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar cliente, teléfono o código..."
              className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10"
            />
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
          <SlidersHorizontal className="mt-2 h-4 w-4 shrink-0 text-zinc-400" />
          {FILTERS.map((filter) => {
            const active = statusFilter === filter.key;
            const count = filter.key === "all"
              ? reservations.length
              : reservations.filter((item) => String(item.status) === filter.key).length;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setStatusFilter(filter.key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                }`}
              >
                {filter.label}
                <span className={active ? "text-zinc-300" : "text-zinc-400"}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div
        className="overflow-hidden rounded-2xl border shadow-sm"

        style={{
          borderColor:
            "rgba(24,24,27,.08)",
          background: "#FFFFFF",
        }}
      >
        {/* MOBILE */}
        <div className="block md:hidden">
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{
              borderColor:
                "rgba(24,24,27,.08)",
              background: "#FAFAFA",
            }}
          >
            <div>
              <p className="text-sm font-bold text-gray-900">
                Reservas
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Toca una reserva para abrir su detalle
              </p>
            </div>

            <span
              className="rounded-full px-2.5 py-1 text-xs font-bold"
              style={{
                background:
                  "rgba(249,115,22,.10)",
                color: "#EA580C",
              }}
            >
              {filteredReservations.length}
            </span>
          </div>

          <div
            className="max-h-[calc(100dvh-260px)] overflow-y-auto overscroll-contain"
            style={{
              WebkitOverflowScrolling:
                "touch",
            }}
          >
            {groupedReservations.map(
              ([date, items]) => (
                <section key={date}>
                  <div
                    className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-2"
                    style={{
                      background:
                        "rgba(250,250,250,.94)",
                      backdropFilter:
                        "blur(10px)",
                      borderColor:
                        "rgba(24,24,27,.06)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={14}
                        className="text-orange-500"
                      />
                      <span className="text-xs font-bold capitalize text-gray-700">
                        {isToday(date)
                          ? "Hoy"
                          : formatDate(date)}
                      </span>
                    </div>

                    <span className="text-[10px] font-semibold text-gray-400">
                      {items.length}{" "}
                      {items.length === 1
                        ? "reserva"
                        : "reservas"}
                    </span>
                  </div>

                  {items.map(
                    (reservation) => (
                      <MobileReservationItem
                        key={reservation.id}
                        reservation={
                          reservation
                        }
                        onOpen={
                          setSelectedReservation
                        }
                      />
                    )
                  )}
                </section>
              )
            )}
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden max-h-[680px] overflow-auto md:block [scrollbar-width:thin]">
          <table className="min-w-full divide-y">
            <ReservationTableHeader />

            <tbody className="divide-y">
              {filteredReservations.map(
                (reservation) => (
                  <ReservationTableRow
                    key={reservation.id}
                    reservation={reservation}
                    onRefresh={onRefresh}
                  />
                )
              )}
            </tbody>
          </table>
          {filteredReservations.length === 0 ? (
            <div className="border-t border-zinc-100 px-6 py-12 text-center text-sm text-zinc-500">
              No encontramos reservas con esos filtros.
            </div>
          ) : null}
        </div>
      </div>

      <WolfSheet
        open={Boolean(selectedReservation)}
        onClose={() =>
          setSelectedReservation(null)
        }
        title="Reserva"
        subtitle={
          selectedReservation
            ? `${formatTime(
                selectedReservation.datetime
                  ?.startTime
              )} · ${
                selectedReservation.guest
                  ?.fullName ||
                "Sin nombre"
              }`
            : undefined
        }
        ariaLabel="Detalle de reserva"
        tone="dark"
        maxWidth={520}
      >
        {selectedReservation ? (
          <ReservationSheetContent
            reservation={
              selectedReservation
            }
            onRefresh={onRefresh}
            onClose={() =>
              setSelectedReservation(
                null
              )
            }
          />
        ) : null}
      </WolfSheet>
    </>
  );
}
