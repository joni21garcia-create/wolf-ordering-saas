"use client";

import {
  useMemo,
  useState,
} from "react";

import ReservationHeader from "./ReservationHeader";
import ReservationContent from "./ReservationContent";

import {
  ReservationWizard,
  ReservationWizardNavigation,
  ReservationWizardHeader,
  useReservationWizard,
} from "@/components/reservations/wizard";

import ReservationCustomerStep from "@/components/reservations/forms/ReservationCustomerStep";
import ReservationDateStep from "@/components/reservations/forms/ReservationDateStep";
import ReservationGuestsStep from "@/components/reservations/forms/ReservationGuestsStep";
import ReservationTimeStep from "@/components/reservations/forms/ReservationTimeStep";
import ReservationTypeStep from "@/components/reservations/forms/ReservationTypeStep";
import ReservationServicesStep from "@/components/reservations/forms/ReservationServicesStep";
import ReservationNotesStep from "@/components/reservations/forms/ReservationNotesStep";
import ReservationSummaryStep from "@/components/reservations/forms/ReservationSummaryStep";

import {
  createReservation,
  getReservationSettings,
} from "@/modules/reservations/actions";

import type {
  Reservation,
  ReservationCalendarEvent,
} from "@/types/reservations";

interface ReservationPageClientProps {
  restaurantId: string;
  reservations: Reservation[];
  events: ReservationCalendarEvent[];
}

const TOTAL_STEPS = 8;

function addMinutes(
  time: string,
  minutes: number
) {
  const [hours, mins] = time
    .split(":")
    .map(Number);

  const total =
    hours * 60 +
    mins +
    minutes;

  const normalized =
    ((total % 1440) + 1440) % 1440;

  const nextHours =
    Math.floor(normalized / 60);

  const nextMinutes =
    normalized % 60;

  return `${String(nextHours).padStart(
    2,
    "0"
  )}:${String(nextMinutes).padStart(
    2,
    "0"
  )}`;
}

function ReservationWizardContent({
  restaurantId,
  onClose,
}: {
  restaurantId: string;
  onClose: () => void;
}) {
  const {
    currentStep,
    data,
    reset,
  } = useReservationWizard();

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const currentComponent =
    useMemo(() => {

      switch (currentStep) {

        // PASO 1
        case 0:
          return (
            <ReservationCustomerStep />
          );

        // PASO 2
        case 1:
          return (
            <ReservationDateStep
              restaurantId={restaurantId}
            />
          );

        // PASO 3
        case 2:
          return (
            <ReservationGuestsStep />
          );

        // PASO 4
        case 3:
          return (
            <ReservationTimeStep
              restaurantId={restaurantId}
            />
          );

        // PASO 5
        case 4:
          return (
            <ReservationTypeStep />
          );

        // PASO 6
        case 5:
          return (
            <ReservationServicesStep />
          );

        // PASO 7
        case 6:
          return (
            <ReservationNotesStep />
          );

        // PASO 8
        case 7:
          return (
            <ReservationSummaryStep />
          );

        default:
          return (
            <ReservationCustomerStep />
          );
      }

    }, [
      currentStep,
      restaurantId,
    ]);

  async function handleConfirm() {

    setError(null);

    if (!data.customerName?.trim()) {
      setError(
        "Ingresa el nombre del cliente."
      );
      return;
    }

    if (!data.phone?.trim()) {
      setError(
        "Ingresa el teléfono del cliente."
      );
      return;
    }

    if (!data.date) {
      setError(
        "Selecciona una fecha."
      );
      return;
    }

    if (!data.time) {
      setError(
        "Selecciona una hora."
      );
      return;
    }

    const guests =
      data.guests ?? 2;

    if (guests < 1) {
      setError(
        "La reserva debe tener al menos una persona."
      );
      return;
    }

    const customerName =
      data.customerName.trim();

    const nameParts =
      customerName.split(/\s+/);

    const firstName =
      nameParts.shift() ??
      customerName;

    const lastName =
      nameParts.join(" ") ||
      undefined;

    const customerNotes =
      data.customerNotes?.trim() ||
      undefined;

    setSaving(true);

    try {

      const settings =
        await getReservationSettings(
          restaurantId
        );

      const durationMinutes =
        Math.max(
          1,
          settings.reservation_duration_minutes
        );

      const timezone =
        settings.timezone ||
        "America/Guayaquil";

      await createReservation({

        restaurantId,

        slug: restaurantId,

        guest: {
          firstName,

          lastName,

          fullName:
            customerName,

          phone:
            data.phone.trim(),

          email:
            data.email?.trim() ||
            undefined,

          notes:
            customerNotes,
        },

        datetime: {
          date: data.date,

          startTime:
            data.time,

          endTime:
            addMinutes(
              data.time,
              durationMinutes
            ),

          timezone,

          durationMinutes,
        },

        capacity: {
          guests,

          adults:
            guests,

          children: 0,

          babies: 0,

          occupiesCapacity:
            guests,
        },

        ...(data.type
          ? {
              typeId: data.type,
              typeName:
                data.typeName?.trim() ||
                undefined,
            }
          : {}),

        ...(data.service
          ? {
              serviceId: data.service,
              serviceName:
                data.serviceName?.trim() ||
                undefined,
            }
          : {}),

        /*
         * El modelo actual del wizard selecciona
         * un servicio principal. No convertimos ese
         * valor en ReservationServiceItem[] porque
         * esa estructura pertenece al catálogo de
         * servicios y no está definida aquí.
         */
        services: [],

        customerNotes,
      });

      reset();

      onClose();

    } catch (caughtError) {

      console.error(
        "CREATE RESERVATION ERROR",
        caughtError
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear la reserva."
      );

    } finally {

      setSaving(false);

    }
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        overflow-y-auto
        bg-[#FAF9F7]
        p-4
        md:p-8
      "
    >

      <div
        className="
          mx-auto
          w-full
          max-w-4xl
          rounded-2xl
          bg-[#FAF9F7]
          p-4
          shadow-2xl
          md:p-6
        "
      >

        <ReservationWizardHeader
          title="Nueva reserva"
        />

        {error ? (
          <div
            className="
              mb-4
              rounded-xl
              border
              border-red-500/30
              bg-red-500/10
              px-4
              py-3
              text-sm
              text-red-300
            "
          >
            {error}
          </div>
        ) : null}

        <div className="min-h-[360px]">
          {currentComponent}
        </div>

        <ReservationWizardNavigation
          onConfirm={
            handleConfirm
          }
          loading={saving}
        />

        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="
            mt-4
            w-full
            rounded-xl
            border
            border-white/10
            px-4
            py-3
            text-sm
            text-white/60
            transition
            hover:bg-white/5
            hover:text-white
            disabled:opacity-40
          "
        >
          Cancelar
        </button>

      </div>

    </div>
  );
}

export default function ReservationPageClient({
  restaurantId,
  reservations,
  events,
}: ReservationPageClientProps) {

  const [
    openCreate,
    setOpenCreate,
  ] = useState(false);

  return (
    <div className="space-y-8">

      <ReservationHeader
        onNewReservation={() =>
          setOpenCreate(true)
        }
      />

      <ReservationContent
        reservations={
          reservations
        }
        events={events}
      />

      {openCreate ? (

        <ReservationWizard
          totalSteps={
            TOTAL_STEPS
          }
        >

          <ReservationWizardContent
            restaurantId={
              restaurantId
            }
            onClose={() =>
              setOpenCreate(false)
            }
          />

        </ReservationWizard>

      ) : null}

    </div>
  );
}