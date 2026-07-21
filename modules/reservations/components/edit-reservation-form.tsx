"use client";

import { useEffect, useState } from "react";

import {
  getReservation,
  updateReservation,
} from "../actions";

interface EditReservationFormProps {
  reservationId: string;

  onSaved?: () => void;
}

export function EditReservationForm({
  reservationId,
  onSaved,
}: EditReservationFormProps) {
  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<any>({
      customer_name: "",
      customer_phone: "",
      customer_email: "",
      reservation_date: "",
      start_time: "",
      end_time: "",
      guests: 1,
      internal_notes: "",
    });

  useEffect(() => {
    loadReservation();
  }, [reservationId]);

  async function loadReservation() {
    try {
      setLoading(true);

      const reservation =
        await getReservation(
          reservationId
        );

      setForm({
        customer_name:
          reservation.customer_name ?? "",

        customer_phone:
          reservation.customer_phone ?? "",

        customer_email:
          reservation.customer_email ?? "",

        reservation_date:
          reservation.reservation_date ?? "",

        start_time:
          reservation.start_time ?? "",

        end_time:
          reservation.end_time ?? "",

        guests:
          reservation.guests ?? 1,

        internal_notes:
          reservation.internal_notes ?? "",
      });
    } finally {
      setLoading(false);
    }
  }

  function change(
    key: string,
    value: any
  ) {
    setForm((old: any) => ({
      ...old,
      [key]: value,
    }));
  }

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setSaving(true);

      await updateReservation(
        reservationId,
        form
      );

      onSaved?.();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        Cargando reserva...
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-lg border bg-white p-6"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">
          Cliente
        </label>

        <input
          className="w-full rounded border px-3 py-2"
          value={form.customer_name}
          onChange={(e) =>
            change(
              "customer_name",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Teléfono
        </label>

        <input
          className="w-full rounded border px-3 py-2"
          value={form.customer_phone}
          onChange={(e) =>
            change(
              "customer_phone",
              e.target.value
            )
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Email
        </label>

        <input
          className="w-full rounded border px-3 py-2"
          value={form.customer_email}
          onChange={(e) =>
            change(
              "customer_email",
              e.target.value
            )
          }
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Fecha
          </label>

          <input
            type="date"
            className="w-full rounded border px-3 py-2"
            value={form.reservation_date}
            onChange={(e) =>
              change(
                "reservation_date",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Inicio
          </label>

          <input
            type="time"
            className="w-full rounded border px-3 py-2"
            value={form.start_time}
            onChange={(e) =>
              change(
                "start_time",
                e.target.value
              )
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Fin
          </label>

          <input
            type="time"
            className="w-full rounded border px-3 py-2"
            value={form.end_time}
            onChange={(e) =>
              change(
                "end_time",
                e.target.value
              )
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Personas
        </label>

        <input
          type="number"
          min={1}
          className="w-full rounded border px-3 py-2"
          value={form.guests}
          onChange={(e) =>
            change(
              "guests",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Notas internas
        </label>

        <textarea
          rows={4}
          className="w-full rounded border px-3 py-2"
          value={form.internal_notes}
          onChange={(e) =>
            change(
              "internal_notes",
              e.target.value
            )
          }
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-black px-5 py-2 text-white disabled:opacity-50"
      >
        {saving
          ? "Guardando..."
          : "Guardar cambios"}
      </button>
    </form>
  );
}

