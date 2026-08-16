"use client";

import { useState } from "react";

export type RestaurantInfo = {
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
};

type RestaurantInfoScreenProps = {
  selectedPlan?: "basic" | "pro" | null;
  initialValues?: Partial<RestaurantInfo> | null;
  onBack?: () => void;
  onContinue?: (data: RestaurantInfo) => void | Promise<void>;
  isSubmitting?: boolean;
};

export function RestaurantInfoScreen({
  selectedPlan = null,
  initialValues = null,
  onBack,
  onContinue,
  isSubmitting = false,
}: RestaurantInfoScreenProps) {
  const [restaurantName, setRestaurantName] = useState(
    initialValues?.restaurantName ?? "",
  );
  const [ownerName, setOwnerName] = useState(
    initialValues?.ownerName ?? "",
  );
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanRestaurantName = restaurantName.trim();
    const cleanOwnerName = ownerName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanRestaurantName) {
      setError("Escribe el nombre de tu restaurante.");
      return;
    }

    if (!cleanOwnerName) {
      setError("Escribe el nombre del propietario.");
      return;
    }

    if (!cleanEmail) {
      setError("Escribe el email del propietario.");
      return;
    }

    if (!cleanPhone) {
      setError("Escribe el telefono del propietario.");
      return;
    }

    if (!selectedPlan) {
      setError("No encontramos el plan seleccionado.");
      return;
    }

    setError(null);

    await onContinue?.({
      restaurantName: cleanRestaurantName,
      ownerName: cleanOwnerName,
      email: cleanEmail,
      phone: cleanPhone,
    });
  };

  return (
    <section className="relative flex min-h-dvh flex-col overflow-hidden bg-[#050505] px-5 pb-28 pt-16 text-white sm:px-6 sm:pt-20">
      <div className="relative z-10 mx-auto w-full max-w-md">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-400">
          DATOS DEL RESTAURANTE
        </p>

        <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
          Cuéntanos sobre tu restaurante.
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/55">
          Estos son los datos iniciales que necesitamos para preparar la
          activacion de tu restaurante.
        </p>

        {selectedPlan && (
          <div className="mt-6 rounded-2xl border border-orange-400/20 bg-orange-500/[0.06] p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-orange-400">
              PLAN
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {selectedPlan === "pro" ? "WOLF PRO - $46/mes" : "WOLF BASICO - $35/mes"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <Field
            label="Nombre del restaurante"
            value={restaurantName}
            onChange={setRestaurantName}
            placeholder="Ej. Restaurante Demo"
          />

          <Field
            label="Nombre del propietario"
            value={ownerName}
            onChange={setOwnerName}
            placeholder="Ej. Juan Perez"
          />

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="tu@email.com"
          />

          <Field
            label="Telefono"
            type="tel"
            value={phone}
            onChange={setPhone}
            placeholder="0999999999"
          />

          {error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/[0.06] p-4 text-sm leading-5 text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold text-white/75 transition hover:bg-white/[0.07] disabled:opacity-40"
            >
              Volver
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-14 flex-[1.5] rounded-2xl bg-orange-500 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Continuar"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: "text" | "email" | "tel";
};

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-orange-400/40 focus:bg-white/[0.06]"
      />
    </label>
  );
}