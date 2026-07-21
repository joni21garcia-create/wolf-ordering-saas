"use client";

import { useState } from "react";

import {
  createReservation,
} from "../actions";

interface CreateReservationFormProps {
  restaurantId: string;

  slug: string;

  onCreated?: (reservation: any) => void;
}

export function CreateReservationForm({
  restaurantId,
  slug,
  onCreated,
}: CreateReservationFormProps) {
  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      customer_name: "",

      customer_phone: "",

      customer_email: "",

      reservation_date: "",

      start_time: "",

      end_time: "",

      guests: 2,

      notes: "",
    });

  function change(
    key: keyof typeof form,
    value: any
  ) {
    setForm(old => ({
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

      const reservation =
        await createReservation({

          restaurantId,

          slug,

          guest:{

            firstName:
              form.customer_name,

            fullName:
              form.customer_name,

            phone:
              form.customer_phone,

            email:
              form.customer_email,

          },

          datetime:{

            date:
              form.reservation_date,

            startTime:
              form.start_time,

            endTime:
              form.end_time,

            timezone:
              "America/Guayaquil",

            durationMinutes:
              120,

          },

          capacity:{

            guests:
              form.guests,

            adults:
              form.guests,

            children:0,

            babies:0,

            occupiesCapacity:
              form.guests,

          },

          customerNotes:
            form.notes,

        });

      onCreated?.(
        reservation
      );

    } finally {

      setSaving(false);

    }
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
          onChange={(e)=>
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
          onChange={(e)=>
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
          onChange={(e)=>
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
            onChange={(e)=>
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
            onChange={(e)=>
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
            onChange={(e)=>
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
          onChange={(e)=>
            change(
              "guests",
              Number(
                e.target.value
              )
            )
          }
        />

      </div>

      <div>

        <label className="mb-1 block text-sm font-medium">
          Notas
        </label>

        <textarea
          rows={4}
          className="w-full rounded border px-3 py-2"
          value={form.notes}
          onChange={(e)=>
            change(
              "notes",
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
        {
          saving
          ? "Creando..."
          : "Crear reserva"
        }
      </button>

    </form>
  );
}

