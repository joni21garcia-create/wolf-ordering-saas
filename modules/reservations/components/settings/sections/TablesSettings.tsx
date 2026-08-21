"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ReservationSettingsRow,
  ReservationSettingsSection,
} from "../ReservationSettingsSection";

import {
  createReservationTable,
  deleteReservationTable,
  listReservationTables,
  updateReservationTable,
} from "../../../actions/table-settings.actions";

import type {
  ReservationTable,
  ReservationTableInput,
} from "../../../repositories/table-settings.repository";

type TablesSettingsProps = {
  restaurantId: string;
};

const EMPTY_FORM: ReservationTableInput = {
  code: "",
  name: "",
  capacity: 4,
  min_capacity: 1,
  max_capacity: 4,
  joinable: true,
  active: true,
  area: "",
  notes: "",
};

function tableToForm(
  table: ReservationTable,
): ReservationTableInput {
  return {
    code: table.code,
    name: table.name,
    capacity: table.capacity,
    min_capacity: table.min_capacity,
    max_capacity:
      table.max_capacity ?? table.capacity,
    joinable: table.joinable,
    active: table.active,
    area: table.area ?? "",
    notes: table.notes ?? "",
  };
}

export function TablesSettings({
  restaurantId,
}: TablesSettingsProps) {
  const [tables, setTables] = useState<
    ReservationTable[]
  >([]);

  const [form, setForm] =
    useState<ReservationTableInput>({
      ...EMPTY_FORM,
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [openTableId, setOpenTableId] =
    useState<string | null>(null);

  const activeTables = useMemo(
    () =>
      tables.filter(
        (table) => table.active,
      ),
    [tables],
  );

  const inactiveTables = useMemo(
    () =>
      tables.filter(
        (table) => !table.active,
      ),
    [tables],
  );

  const totalCapacity = useMemo(
    () =>
      activeTables.reduce(
        (total, table) =>
          total + table.capacity,
        0,
      ),
    [activeTables],
  );

  const joinableCount = useMemo(
    () =>
      activeTables.filter(
        (table) => table.joinable,
      ).length,
    [activeTables],
  );

  const loadTables = async () => {
    setLoading(true);
    setError(null);

    try {
      const result =
        await listReservationTables(
          restaurantId,
        );

      setTables(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las mesas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTables();
  }, [restaurantId]);

  const resetForm = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
    });
  };

  const closeForm = () => {
    resetForm();
    setFormOpen(false);
  };

  const openCreateForm = () => {
    setError(null);
    resetForm();
    setFormOpen(true);

    window.setTimeout(() => {
      document
        .getElementById(
          "reservation-table-form",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const openEditForm = (
    table: ReservationTable,
  ) => {
    setError(null);
    setEditingId(table.id);
    setForm(tableToForm(table));
    setFormOpen(true);
    setOpenTableId(table.id);

    window.setTimeout(() => {
      document
        .getElementById(
          "reservation-table-form",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };

  const updateForm = <
    K extends keyof ReservationTableInput,
  >(
    field: K,
    value: ReservationTableInput[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveTable = async () => {
    setSaving(true);
    setError(null);

    try {
      const capacity = Math.max(
        1,
        Number(form.capacity) || 1,
      );

      const minCapacity = Math.max(
        1,
        Math.min(
          capacity,
          Number(form.min_capacity) || 1,
        ),
      );

      const maxCapacity = Math.max(
        capacity,
        Number(
          form.max_capacity ??
            capacity,
        ) || capacity,
      );

      const normalized: ReservationTableInput = {
        ...form,

        code: form.code
          .trim()
          .toUpperCase(),

        name: form.name.trim(),

        capacity,

        min_capacity:
          minCapacity,

        max_capacity:
          maxCapacity,

        area:
          form.area?.trim() || "",

        notes:
          form.notes?.trim() || "",
      };

      if (!normalized.code) {
        throw new Error(
          "El código de la mesa es obligatorio.",
        );
      }

      if (!normalized.name) {
        throw new Error(
          "El nombre de la mesa es obligatorio.",
        );
      }

const normalizedMinCapacity =
  normalized.min_capacity ?? 1;

const normalizedMaxCapacity =
  normalized.max_capacity ??
  normalized.capacity;

if (
  normalizedMinCapacity >
  normalizedMaxCapacity
) {
  throw new Error(
    "El mínimo no puede ser mayor que el máximo.",
  );
}

      if (editingId) {
        const updated =
          await updateReservationTable(
            restaurantId,
            editingId,
            normalized,
          );

        setTables((current) =>
          current.map((table) =>
            table.id === updated.id
              ? updated
              : table,
          ),
        );

        setOpenTableId(updated.id);
      } else {
        const created =
          await createReservationTable(
            restaurantId,
            normalized,
          );

        setTables((current) => [
          ...current,
          created,
        ]);

        setOpenTableId(created.id);
      }

      setFormOpen(false);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la mesa.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleTable = async (
    table: ReservationTable,
  ) => {
    setSaving(true);
    setError(null);

    try {
      const updated =
        await updateReservationTable(
          restaurantId,
          table.id,
          {
            ...tableToForm(table),
            active: !table.active,
          },
        );

      setTables((current) =>
        current.map((item) =>
          item.id === updated.id
            ? updated
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la mesa.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTable = async (
    table: ReservationTable,
  ) => {
    const confirmed =
      window.confirm(
        `¿Quieres eliminar "${table.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await deleteReservationTable(
        restaurantId,
        table.id,
      );

      setTables((current) =>
        current.filter(
          (item) =>
            item.id !== table.id,
        ),
      );

      if (editingId === table.id) {
        closeForm();
      }

      if (openTableId === table.id) {
        setOpenTableId(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la mesa.",
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleTableDetails = (
    tableId: string,
  ) => {
    setOpenTableId((current) =>
      current === tableId
        ? null
        : tableId,
    );
  };

  return (
    <ReservationSettingsSection
      title="Mesas"
      description="Configura las mesas que utilizará el sistema para asignar reservas automáticamente."
    >
      {/* =====================================================
          ERROR
      ====================================================== */}
      {error ? (
        <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {/* =====================================================
          RESUMEN
      ====================================================== */}
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.025]">
          <p className="text-xs font-medium text-black/45 dark:text-white/45">
            Mesas activas
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-black dark:text-white">
            {activeTables.length}
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.025]">
          <p className="text-xs font-medium text-black/45 dark:text-white/45">
            Capacidad
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-black dark:text-white">
            {totalCapacity}
          </p>

          <p className="text-[11px] text-black/35 dark:text-white/35">
            personas
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.025] sm:col-span-1">
          <p className="text-xs font-medium text-black/45 dark:text-white/45">
            Combinables
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-black dark:text-white">
            {joinableCount}
          </p>

          <p className="text-[11px] text-black/35 dark:text-white/35">
            disponibles para combinar
          </p>
        </div>
      </div>

      {/* =====================================================
          ACTION BAR
      ====================================================== */}
      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/[0.025] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-black dark:text-white">
            Tus mesas
          </p>

          <p className="mt-0.5 text-xs leading-5 text-black/45 dark:text-white/45">
            Define cómo se asignarán automáticamente
            a las reservas.
          </p>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={openCreateForm}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
        >
          <span className="text-base leading-none">
            +
          </span>

          Añadir mesa
        </button>
      </div>

      {/* =====================================================
          CREATE / EDIT FORM
      ====================================================== */}
      {formOpen ? (
        <div
          id="reservation-table-form"
          className="mb-6 scroll-mt-6 overflow-hidden rounded-3xl border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.025]"
        >
          <div className="border-b border-black/10 px-5 py-5 dark:border-white/10 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                    {editingId
                      ? "Editar"
                      : "Nueva mesa"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {editingId
                    ? "Editar configuración"
                    : "Añadir mesa"}
                </h3>

                <p className="mt-1 text-xs leading-5 text-black/45 dark:text-white/45">
                  Configura la capacidad y las reglas
                  que utilizará el sistema.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                aria-label="Cerrar formulario"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-black/40 transition hover:bg-black/5 hover:text-black dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Código */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Código
                </span>

                <input
                  value={form.code}
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "code",
                      event.target.value,
                    )
                  }
                  placeholder="M01"
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:border-white/30"
                />

                <span className="mt-1 block text-[11px] text-black/35 dark:text-white/35">
                  Identificador interno de la mesa.
                </span>
              </label>

              {/* Nombre */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Nombre
                </span>

                <input
                  value={form.name}
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value,
                    )
                  }
                  placeholder="Mesa 1"
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:border-white/30"
                />
              </label>

              {/* Capacidad */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Capacidad
                </span>

                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "capacity",
                      Number(
                        event.target.value,
                      ) || 1,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
                />

                <span className="mt-1 block text-[11px] text-black/35 dark:text-white/35">
                  Capacidad habitual de la mesa.
                </span>
              </label>

              {/* Área */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Área
                </span>

                <input
                  value={form.area ?? ""}
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "area",
                      event.target.value,
                    )
                  }
                  placeholder="Terraza, salón..."
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition placeholder:text-black/25 focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 dark:focus:border-white/30"
                />
              </label>

              {/* Mínimo */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Mínimo de personas
                </span>

                <input
                  type="number"
                  min={1}
                  max={form.capacity}
                  value={form.min_capacity}
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "min_capacity",
                      Number(
                        event.target.value,
                      ) || 1,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
                />
              </label>

              {/* Máximo */}
              <label>
                <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/50">
                  Máximo de personas
                </span>

                <input
                  type="number"
                  min={form.capacity}
                  value={
                    form.max_capacity ??
                    form.capacity
                  }
                  disabled={saving}
                  onChange={(event) =>
                    updateForm(
                      "max_capacity",
                      Number(
                        event.target.value,
                      ) || form.capacity,
                    )
                  }
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm text-black outline-none transition focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/30"
                />
              </label>
            </div>

            {/* Opciones */}
            <div className="mt-6 divide-y divide-black/10 rounded-2xl border border-black/10 dark:divide-white/10 dark:border-white/10">
              <ReservationSettingsRow
                label="Mesa combinable"
                description="Permite que el sistema una esta mesa con otras para grupos grandes."
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    Boolean(form.joinable)
                  }
                  disabled={saving}
                  onClick={() =>
                    updateForm(
                      "joinable",
                      !form.joinable,
                    )
                  }
                  className={[
                    "relative inline-flex h-7 w-12 shrink-0",
                    "items-center rounded-full p-1",
                    "transition-colors duration-200",
                    form.joinable
                      ? "bg-black dark:bg-white"
                      : "bg-black/15 dark:bg-white/15",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-5 w-5 rounded-full bg-white shadow-sm",
                      "transition-transform duration-200",
                      form.joinable
                        ? "translate-x-5 dark:bg-black"
                        : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </ReservationSettingsRow>

              <ReservationSettingsRow
                label="Mesa activa"
                description="Una mesa inactiva no podrá ser asignada a nuevas reservas."
              >
                <button
                  type="button"
                  role="switch"
                  aria-checked={
                    Boolean(form.active)
                  }
                  disabled={saving}
                  onClick={() =>
                    updateForm(
                      "active",
                      !form.active,
                    )
                  }
                  className={[
                    "relative inline-flex h-7 w-12 shrink-0",
                    "items-center rounded-full p-1",
                    "transition-colors duration-200",
                    form.active
                      ? "bg-black dark:bg-white"
                      : "bg-black/15 dark:bg-white/15",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-5 w-5 rounded-full bg-white shadow-sm",
                      "transition-transform duration-200",
                      form.active
                        ? "translate-x-5 dark:bg-black"
                        : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </ReservationSettingsRow>
            </div>

            {/* Acciones */}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={saving}
                onClick={closeForm}
                className="h-11 rounded-xl px-4 text-sm font-medium text-black/55 transition hover:bg-black/5 disabled:opacity-40 dark:text-white/55 dark:hover:bg-white/5"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  void saveTable()
                }
                className="h-11 rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-black"
              >
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Añadir mesa"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* =====================================================
          LISTADO
      ====================================================== */}
      <div>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">
              Mesas configuradas
            </h3>

            <p className="mt-1 text-xs leading-5 text-black/40 dark:text-white/40">
              Toca una mesa para ver o editar sus detalles.
            </p>
          </div>

          {inactiveTables.length > 0 ? (
            <span className="shrink-0 text-[11px] text-black/35 dark:text-white/35">
              {inactiveTables.length} inactiva
              {inactiveTables.length === 1
                ? ""
                : "s"}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[76px] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5"
              />
            ))}
          </div>
        ) : tables.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/15 px-5 py-12 text-center dark:border-white/15">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5 text-xl text-black/40 dark:bg-white/10 dark:text-white/40">
              +
            </div>

            <p className="mt-4 text-sm font-semibold text-black dark:text-white">
              Todavía no hay mesas
            </p>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-black/40 dark:text-white/40">
              Añade la primera mesa para que el
              sistema pueda asignarla automáticamente
              a las reservas.
            </p>

            <button
              type="button"
              disabled={saving}
              onClick={openCreateForm}
              className="mt-5 h-10 rounded-xl bg-black px-4 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-40 dark:bg-white dark:text-black"
            >
              Añadir primera mesa
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {tables.map((table) => {
              const isOpen =
                openTableId === table.id;

              return (
                <div
                  key={table.id}
                  className={[
                    "overflow-hidden rounded-2xl border",
                    "transition-all duration-200",
                    table.active
                      ? "border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.025]"
                      : "border-black/10 bg-black/[0.015] opacity-75 dark:border-white/10 dark:bg-white/[0.015]",
                  ].join(" ")}
                >
                  {/* =================================================
                      COMPACT TABLE ROW
                  ================================================== */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleTableDetails(
                        table.id,
                      )
                    }
                    className="w-full px-4 py-4 text-left sm:px-5"
                  >
                    <div className="flex items-center gap-3">
                      {/* Código */}
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-[11px] font-bold text-black/55 dark:bg-white/10 dark:text-white/55">
                        {table.code}
                      </span>

                      {/* Nombre + resumen */}
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-black dark:text-white">
                            {table.name}
                          </span>

                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[10px] font-medium",
                              table.active
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40",
                            ].join(" ")}
                          >
                            {table.active
                              ? "Activa"
                              : "Inactiva"}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-black/40 dark:text-white/40">
                          <span>
                            {table.capacity}{" "}
                            {table.capacity === 1
                              ? "persona"
                              : "personas"}
                          </span>

                          <span>·</span>

                          <span>
                            {table.min_capacity}–
                            {table.max_capacity ??
                              table.capacity}
                          </span>

                          {table.area ? (
                            <>
                              <span>·</span>
                              <span className="truncate">
                                {table.area}
                              </span>
                            </>
                          ) : null}

                          {table.joinable ? (
                            <>
                              <span>·</span>
                              <span>
                                Combinable
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {/* Chevron */}
                      <span
                        aria-hidden="true"
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                          "text-black/35 transition-transform duration-200",
                          "dark:text-white/35",
                          isOpen
                            ? "rotate-180 bg-black/5 dark:bg-white/10"
                            : "",
                        ].join(" ")}
                      >
                        ↓
                      </span>
                    </div>
                  </button>

                  {/* =================================================
                      EXPANDED DETAILS
                  ================================================== */}
                  {isOpen ? (
                    <div className="border-t border-black/10 dark:border-white/10">
                      <div className="p-4 sm:p-5">
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                          <div className="rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.035]">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                              Capacidad
                            </p>

                            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                              {table.capacity}
                            </p>

                            <p className="text-[10px] text-black/35 dark:text-white/35">
                              personas
                            </p>
                          </div>

                          <div className="rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.035]">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                              Mínimo
                            </p>

                            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                              {table.min_capacity}
                            </p>

                            <p className="text-[10px] text-black/35 dark:text-white/35">
                              personas
                            </p>
                          </div>

                          <div className="rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.035]">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                              Máximo
                            </p>

                            <p className="mt-1 text-sm font-semibold text-black dark:text-white">
                              {table.max_capacity ??
                                table.capacity}
                            </p>

                            <p className="text-[10px] text-black/35 dark:text-white/35">
                              personas
                            </p>
                          </div>

                          <div className="rounded-xl bg-black/[0.025] p-3 dark:bg-white/[0.035]">
                            <p className="text-[10px] font-medium uppercase tracking-wide text-black/35 dark:text-white/35">
                              Área
                            </p>

                            <p className="mt-1 truncate text-sm font-semibold text-black dark:text-white">
                              {table.area ||
                                "Sin definir"}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10">
                          <ReservationSettingsRow
                            label="Mesa combinable"
                            description={
                              table.joinable
                                ? "Puede combinarse con otras mesas para grupos grandes."
                                : "El sistema utilizará esta mesa de forma independiente."
                            }
                          >
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                                table.joinable
                                  ? "bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60"
                                  : "bg-black/5 text-black/35 dark:bg-white/10 dark:text-white/35",
                              ].join(" ")}
                            >
                              {table.joinable
                                ? "Sí"
                                : "No"}
                            </span>
                          </ReservationSettingsRow>

                          <ReservationSettingsRow
                            label="Estado"
                            description={
                              table.active
                                ? "Puede ser asignada a nuevas reservas."
                                : "No se asignará a nuevas reservas."
                            }
                          >
                            <span
                              className={[
                                "rounded-full px-2.5 py-1 text-[11px] font-medium",
                                table.active
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                  : "bg-black/5 text-black/40 dark:bg-white/10 dark:text-white/40",
                              ].join(" ")}
                            >
                              {table.active
                                ? "Activa"
                                : "Inactiva"}
                            </span>
                          </ReservationSettingsRow>
                        </div>

                        {table.notes ? (
                          <div className="mt-4 rounded-2xl bg-black/[0.025] p-4 dark:bg-white/[0.035]">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-black/35 dark:text-white/35">
                              Notas
                            </p>

                            <p className="mt-1 text-xs leading-5 text-black/55 dark:text-white/55">
                              {table.notes}
                            </p>
                          </div>
                        ) : null}

                        {/* Acciones */}
                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              openEditForm(
                                table,
                              )
                            }
                            className="h-10 flex-1 rounded-xl border border-black/10 px-4 text-xs font-medium text-black/65 transition hover:bg-black/5 disabled:opacity-40 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/5"
                          >
                            Editar mesa
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void toggleTable(
                                table,
                              )
                            }
                            className="h-10 flex-1 rounded-xl border border-black/10 px-4 text-xs font-medium text-black/65 transition hover:bg-black/5 disabled:opacity-40 dark:border-white/10 dark:text-white/65 dark:hover:bg-white/5"
                          >
                            {table.active
                              ? "Desactivar"
                              : "Activar"}
                          </button>

                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void removeTable(
                                table,
                              )
                            }
                            className="h-10 rounded-xl border border-red-500/15 px-4 text-xs font-medium text-red-600 transition hover:bg-red-500/5 disabled:opacity-40 dark:text-red-300"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          HELP / EXPLANATION
      ====================================================== */}
      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 dark:border-white/10 dark:bg-white/[0.025]">
        <div className="flex items-start gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-semibold text-black/50 dark:bg-white/10 dark:text-white/50">
            i
          </span>

          <div>
            <p className="text-xs font-semibold text-black dark:text-white">
              ¿Cómo utiliza estas mesas el sistema?
            </p>

            <p className="mt-1 text-[11px] leading-5 text-black/40 dark:text-white/40">
              Primero intenta asignar una mesa que tenga
              capacidad suficiente. Si el grupo es más
              grande, puede combinar mesas marcadas como
              combinables, siempre que estén disponibles.
            </p>
          </div>
        </div>
      </div>
    </ReservationSettingsSection>
  );
}