 "use client";

import { useEffect, useMemo, useState } from "react";

import {
  ReservationWizard,
  ReservationWizardHeader,
  ReservationWizardStep,
  useReservationWizard,
} from "@/components/reservations/wizard";

import ReservationCustomerStep from "@/components/reservations/forms/ReservationCustomerStep";
import ReservationTypeStep from "@/components/reservations/forms/ReservationTypeStep";
import ReservationServicesStep from "@/components/reservations/forms/ReservationServicesStep";
import ReservationNotesStep from "@/components/reservations/forms/ReservationNotesStep";
import ReservationSummaryStep from "@/components/reservations/forms/ReservationSummaryStep";

import {
  createReservation,
  getAvailableReservationDates,
  getAvailableReservationTimes,
  getReservationSettings,
} from "@/modules/reservations/actions";

interface Props {
  restaurantId: string;
  restaurantName?: string;
  slug: string;
}

const TOTAL_STEPS = 8;

const RESERVATION_TYPE_LABELS: Record<string, string> = {
  table: "Mesa en restaurante",
  event: "Evento especial",
  private: "Área privada",
};

const RESERVATION_SERVICE_LABELS: Record<string, string> = {
  normal: "Reserva normal",
  birthday: "Cumpleaños",
  business: "Reunión empresarial",
  special: "Ocasión especial",
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateString(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = time.split(":").map(Number);
  const total = hours * 60 + mins + minutes;
  const normalized = ((total % 1440) + 1440) % 1440;
  return `${pad(Math.floor(normalized / 60))}:${pad(normalized % 60)}`;
}

function formatDate(value?: string) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDate(value));
}

/* -------------------------------------------------------------------------- */
/* PASO 1 - CLIENTE                                                           */
/* -------------------------------------------------------------------------- */

function CustomerStepWithNotes() {
  const { data, update } = useReservationWizard();

  return (
    <ReservationWizardStep>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Tus datos
        </h2>
        <p className="text-sm text-zinc-500">
          Necesitamos estos datos para confirmar tu reserva.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Nombre completo
          </span>
          <input
            type="text"
            value={data.customerName ?? ""}
            onChange={(event) =>
              update({ customerName: event.target.value })
            }
            placeholder="Ej. Juan Pérez"
            autoComplete="name"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 caret-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Teléfono
          </span>
          <input
            type="tel"
            value={data.phone ?? ""}
            onChange={(event) =>
              update({ phone: event.target.value })
            }
            placeholder="+593 999999999"
            autoComplete="tel"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 caret-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Correo electrónico
            <span className="ml-1 text-zinc-400">(opcional)</span>
          </span>
          <input
            type="email"
            value={data.email ?? ""}
            onChange={(event) =>
              update({ email: event.target.value })
            }
            placeholder="correo@email.com"
            autoComplete="email"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 caret-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">
            Notas adicionales
          </span>
          <textarea
            value={data.customerNotes ?? ""}
            onChange={(event) =>
              update({ customerNotes: event.target.value })
            }
            placeholder="Alguna solicitud especial, alergia, celebración..."
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 caret-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>
      </div>
    </ReservationWizardStep>
  );
}

/* -------------------------------------------------------------------------- */
/* PASO 2 - CALENDARIO                                                        */
/* -------------------------------------------------------------------------- */

function CalendarStep({ restaurantId }: { restaurantId: string }) {
  const { data, update } = useReservationWizard();

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const initialMonth = useMemo(() => {
    if (data.date) {
      const selected = parseDate(data.date);
      return new Date(selected.getFullYear(), selected.getMonth(), 1);
    }

    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }, [data.date]);

  const [currentMonth, setCurrentMonth] = useState(initialMonth);

  useEffect(() => {
    setCurrentMonth(initialMonth);
  }, [initialMonth]);

  useEffect(() => {
    let mounted = true;

    async function loadDates() {
      setLoading(true);

      try {
        const dates = await getAvailableReservationDates(restaurantId);

        if (mounted) {
          setAvailableDates(dates ?? []);
        }
      } catch (error) {
        console.error("ERROR LOADING RESERVATION DATES", error);
        if (mounted) setAvailableDates([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDates();

    return () => {
      mounted = false;
    };
  }, [restaurantId]);

  const availableSet = useMemo(
    () => new Set(availableDates),
    [availableDates]
  );

  const monthLabel = new Intl.DateTimeFormat("es-EC", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;

    const result: Array<Date | null> = [];

    for (let i = 0; i < startOffset; i++) result.push(null);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      result.push(new Date(year, month, day, 12, 0, 0));
    }

    return result;
  }, [currentMonth]);

  function previousMonth() {
    setCurrentMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + 1, 1)
    );
  }

  const today = new Date();

  const firstAvailable = availableDates.length
    ? parseDate([...availableDates].sort()[0])
    : null;

  const minimumMonth = firstAvailable
    ? new Date(firstAvailable.getFullYear(), firstAvailable.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);

  const isBeforeMinimumMonth = currentMonth < minimumMonth;

  return (
    <ReservationWizardStep>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          ¿Qué día deseas reservar?
        </h2>
        <p className="text-sm text-zinc-500">
          Selecciona uno de los días disponibles.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
        </div>
      ) : availableDates.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="font-medium text-zinc-800">
            No hay fechas disponibles.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Por favor, vuelve a intentarlo más adelante.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              disabled={isBeforeMinimumMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-lg text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mes anterior"
            >
              ‹
            </button>

            <h3 className="text-lg font-bold capitalize text-zinc-900">
              {monthLabel}
            </h3>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-lg text-zinc-700 transition hover:bg-zinc-50"
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(
              (day) => (
                <div
                  key={day}
                  className="py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400"
                >
                  {day}
                </div>
              )
            )}

            {days.map((date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square"
                  />
                );
              }

              const dateString = toDateString(date);
              const available = availableSet.has(dateString);
              const selected = data.date === dateString;
              const isToday = toDateString(today) === dateString;

              return (
                <button
                  key={dateString}
                  type="button"
                  disabled={!available}
                  onClick={() => update({ date: dateString })}
                  className={`relative aspect-square rounded-xl text-sm font-semibold transition ${
                    selected
                      ? "bg-zinc-900 text-white shadow-sm"
                      : available
                        ? "text-zinc-900 hover:bg-zinc-100"
                        : "cursor-not-allowed text-zinc-300"
                  }`}
                >
                  {date.getDate()}

                  {isToday && !selected ? (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-zinc-900" />
                  ) : null}
                </button>
              );
            })}
          </div>

          {data.date ? (
            <div className="mt-5 rounded-xl bg-zinc-50 px-4 py-3 text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Fecha seleccionada
              </p>
              <p className="mt-1 text-sm font-semibold capitalize text-zinc-800">
                {formatDate(data.date)}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </ReservationWizardStep>
  );
}

/* -------------------------------------------------------------------------- */
/* PASO 3 - PERSONAS                                                          */
/* -------------------------------------------------------------------------- */

function GuestsStep() {
  const { data, update } = useReservationWizard();
  const guests = Math.max(1, data.guests ?? 2);

  return (
    <ReservationWizardStep>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          ¿Cuántas personas?
        </h2>
        <p className="text-sm text-zinc-500">
          Indica el número de personas para la reserva.
        </p>
      </div>

      <div className="mx-auto mt-10 flex max-w-sm items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
        <button
          type="button"
          disabled={guests <= 1}
          onClick={() => update({ guests: Math.max(1, guests - 1) })}
          className="h-12 w-12 rounded-xl border border-zinc-200 bg-white text-2xl font-light text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>

        <div className="text-center">
          <div className="text-5xl font-black tracking-tight text-zinc-900">
            {guests}
          </div>
          <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            {guests === 1 ? "persona" : "personas"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => update({ guests: guests + 1 })}
          className="h-12 w-12 rounded-xl border border-zinc-200 bg-white text-2xl font-light text-zinc-800 transition hover:bg-zinc-100"
        >
          +
        </button>
      </div>
    </ReservationWizardStep>
  );
}

/* -------------------------------------------------------------------------- */
/* PASO 4 - HORA                                                              */
/* -------------------------------------------------------------------------- */

function TimeStep({ restaurantId }: { restaurantId: string }) {
  const { data, update } = useReservationWizard();
  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTimes() {
      if (!data.date) {
        setTimes([]);
        return;
      }

      setLoading(true);

      try {
        const available = await getAvailableReservationTimes(
          restaurantId,
          data.date,
          data.guests ?? 1
        );

        if (mounted) setTimes(available ?? []);
      } catch (error) {
        console.error("ERROR LOADING RESERVATION TIMES", error);
        if (mounted) setTimes([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTimes();

    return () => {
      mounted = false;
    };
  }, [restaurantId, data.date, data.guests]);

  return (
    <ReservationWizardStep>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Selecciona una hora
        </h2>
        <p className="text-sm text-zinc-500">
          Solo mostramos horarios disponibles para tu grupo.
        </p>
      </div>

      {data.date ? (
        <div className="mt-5 rounded-xl bg-zinc-50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Fecha
          </p>
          <p className="mt-1 text-sm font-semibold capitalize text-zinc-800">
            {formatDate(data.date)}
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 flex justify-center py-8">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
        </div>
      ) : times.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-center">
          <p className="font-medium text-zinc-800">
            No hay horarios disponibles.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Prueba con otra fecha o cantidad de personas.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {times.map((time) => {
            const selected = data.time === time;

            return (
              <button
                key={time}
                type="button"
                onClick={() => update({ time })}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50"
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </ReservationWizardStep>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTENIDO DEL WIZARD - SIEMPRE DENTRO DEL PROVIDER                         */
/* -------------------------------------------------------------------------- */

const STEP_TITLES = [
  "Tus datos",
  "Elige la fecha",
  "Número de personas",
  "Selecciona la hora",
  "Tipo de reserva",
  "Tipo de servicio",
  "Notas",
  "Confirma tu reserva",
] as const;

function ReservationContentInner({
  restaurantId,
  restaurantName,
}: {
  restaurantId: string;
  restaurantName?: string;
}) {
  const { currentStep, data, next, previous, reset } =
    useReservationWizard();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const components = [
    <CustomerStepWithNotes key="customer" />,
    <CalendarStep key="calendar" restaurantId={restaurantId} />,
    <GuestsStep key="guests" />,
    <TimeStep key="time" restaurantId={restaurantId} />,
    <ReservationTypeStep key="type" />,
    <ReservationServicesStep key="services" />,
    <ReservationNotesStep key="notes" />,
    <ReservationSummaryStep key="summary" />,
  ];

  function validateCurrentStep() {
    setError(null);

    if (currentStep === 0) {
      if (!data.customerName?.trim()) {
        setError("Ingresa tu nombre completo.");
        return false;
      }

      if (!data.phone?.trim()) {
        setError("Ingresa tu número de teléfono.");
        return false;
      }
    }

    if (currentStep === 1 && !data.date) {
      setError("Selecciona una fecha.");
      return false;
    }

    if (currentStep === 2 && (!data.guests || data.guests < 1)) {
      setError("Selecciona al menos una persona.");
      return false;
    }

    if (currentStep === 3 && !data.time) {
      setError("Selecciona una hora.");
      return false;
    }

    if (currentStep === 4 && !data.type) {
      setError("Selecciona el tipo de reserva.");
      return false;
    }

    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    next();
  }

  async function handleConfirm() {
    if (!validateCurrentStep()) return;

    if (
      !data.customerName?.trim() ||
      !data.phone?.trim() ||
      !data.date ||
      !data.time
    ) {
      return;
    }

    const guests = data.guests ?? 2;
    const customerName = data.customerName.trim();
    const nameParts = customerName.split(/\s+/);
    const firstName = nameParts.shift() ?? customerName;
    const lastName = nameParts.join(" ") || undefined;
    const customerNotes = data.customerNotes?.trim() || undefined;
    const typeName = data.type
      ? RESERVATION_TYPE_LABELS[data.type] ?? data.type
      : undefined;
    const serviceName = data.service
      ? RESERVATION_SERVICE_LABELS[data.service] ?? data.service
      : undefined;

    setError(null);
    setSaving(true);

    try {
      const settings = await getReservationSettings(restaurantId);
      const durationMinutes = Math.max(
        1,
        settings.reservation_duration_minutes
      );
      const timezone =
        settings.timezone || "America/Guayaquil";

      await createReservation({
        restaurantId,
        slug: restaurantId,

        guest: {
          firstName,
          lastName,
          fullName: customerName,
          phone: data.phone.trim(),
          email: data.email?.trim() || undefined,
          notes: customerNotes,
        },

        datetime: {
          date: data.date,
          startTime: data.time,
          endTime: addMinutes(data.time, durationMinutes),
          timezone,
          durationMinutes,
        },

        capacity: {
          guests,
          adults: guests,
          children: 0,
          babies: 0,
          occupiesCapacity: guests,
        },

        ...(data.type
          ? {
              typeId: data.type,
              typeName,
            }
          : {}),

        ...(data.service
          ? {
              serviceId: data.service,
              serviceName,
            }
          : {}),

        services: [],

        customerNotes,
      });

      setConfirmed(true);
    } catch (caughtError) {
      console.error("CREATE CUSTOMER RESERVATION ERROR", caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear la reserva."
      );
    } finally {
      setSaving(false);
    }
  }

  if (confirmed) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center justify-center px-4 py-10">
        <div className="w-full rounded-3xl border border-zinc-200 bg-white p-7 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white">
            ✓
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900">
            ¡Reserva confirmada!
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Tu reserva quedó registrada correctamente.
          </p>

          <div className="mt-7 rounded-2xl bg-zinc-50 p-5 text-left">
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-zinc-500">Cliente: </span>
                <strong>{data.customerName ?? "—"}</strong>
              </p>
              <p>
                <span className="text-zinc-500">Fecha: </span>
                <strong className="capitalize">{formatDate(data.date)}</strong>
              </p>
              <p>
                <span className="text-zinc-500">Hora: </span>
                <strong>{data.time ?? "—"}</strong>
              </p>
              <p>
                <span className="text-zinc-500">Personas: </span>
                <strong>{data.guests ?? 2}</strong>
              </p>
              {data.customerNotes ? (
                <p>
                  <span className="text-zinc-500">Notas: </span>
                  <strong>{data.customerNotes}</strong>
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              reset();
              setConfirmed(false);
              setError(null);
            }}
            className="mt-7 w-full rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ReservationWizardHeader
        title={STEP_TITLES[currentStep] ?? "Reserva"}
      />

      {error ? (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="min-h-[420px] pt-2 sm:pt-3">
        {components[currentStep]}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-zinc-200/80 pt-5">
        <button
          type="button"
          onClick={previous}
          disabled={currentStep === 0 || saving}
          className="rounded-xl border border-zinc-300 bg-transparent px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30"
        >
          Atrás
        </button>

        {currentStep < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
          >
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className="rounded-xl bg-[#d65a1f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#bf4e19] focus:outline-none focus:ring-4 focus:ring-[#d65a1f]/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Confirmando..." : "Confirmar reserva"}
          </button>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* PÁGINA - EL PROVIDER ENVUELVE AL CONTENIDO                                 */
/* -------------------------------------------------------------------------- */

export default function ReservationCustomerPage(props: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
            Reservación
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            {props.restaurantName ?? "Reserva tu mesa"}
          </h1>
        </div>

        <ReservationWizard totalSteps={TOTAL_STEPS}>
          <ReservationContentInner
            restaurantId={props.restaurantId}
            restaurantName={props.restaurantName}
          />
        </ReservationWizard>
      </div>
    </div>
  );
}