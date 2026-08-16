"use client";

import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  Search,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase/client";

import RestaurantRequestStatusBadge from "./RestaurantRequestStatusBadge";

export type RestaurantRequestDetailData = {
  id: string;
  user_id: string;
  restaurant_name: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  plan: string;
  paypal_plan_id: string | null;
  paypal_subscription_id: string | null;
  payment_status: string;
  subscription_status: string;
  request_status: string;
  restaurant_id: string | null;
  created_at: string;
  updated_at: string;
};

type RestaurantSearchResult = {
  id: string;
  name: string;
  slug: string;
};

type RestaurantSearchResponse = {
  success: boolean;
  restaurants?: RestaurantSearchResult[];
  error?: string;
  message?: string;
};

type RestaurantRequestDetailProps = {
  request: RestaurantRequestDetailData;
  onCreateRestaurant?: () => void;
  creatingRestaurant?: boolean;
  onBack?: () => void;
};

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getPlanLabel(plan: string) {
  if (!plan) return "Sin plan";

  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function getPaymentLabel(status: string) {
  switch (status) {
    case "completed":
      return "Completado";
    case "pending":
      return "Pendiente";
    case "failed":
      return "Fallido";
    case "refunded":
      return "Reembolsado";
    default:
      return status || "Sin estado";
  }
}

function getSubscriptionLabel(status: string) {
  switch (status) {
    case "active":
      return "Activa";
    case "pending":
      return "Pendiente";
    case "cancelled":
      return "Cancelada";
    case "suspended":
      return "Suspendida";
    default:
      return status || "Sin estado";
  }
}

async function copyValue(
  value: string,
  setCopied: (value: string) => void,
) {
  try {
    await navigator.clipboard.writeText(value);
    setCopied(value);

    window.setTimeout(() => {
      setCopied("");
    }, 1600);
  } catch {
    setCopied("");
  }
}

export default function RestaurantRequestDetail({
  request,
  onCreateRestaurant,
  creatingRestaurant = false,
  onBack,
}: RestaurantRequestDetailProps) {
  const [copied, setCopied] = useState("");
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [restaurantResults, setRestaurantResults] = useState<
    RestaurantSearchResult[]
  >([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantSearchResult | null>(null);
  const [searchingRestaurants, setSearchingRestaurants] =
    useState(false);
  const [associatingRestaurant, setAssociatingRestaurant] =
    useState(false);
  const [associationError, setAssociationError] = useState("");
  const [associationSuccess, setAssociationSuccess] =
    useState(false);
  const [restaurantId, setRestaurantId] = useState(
    request.restaurant_id,
  );
  const [showAssociationConfirm, setShowAssociationConfirm] =
    useState(false);

  const hasRestaurant = Boolean(restaurantId);

  useEffect(() => {
    setRestaurantId(request.restaurant_id);
    setSelectedRestaurant(null);
    setRestaurantSearch("");
    setAssociationSuccess(false);
    setAssociationError("");
  }, [request.id, request.restaurant_id]);

  useEffect(() => {
    let cancelled = false;

    const searchRestaurants = async () => {
      const query = restaurantSearch.trim();

      if (restaurantId || query.length < 2) {
        setRestaurantResults([]);
        setSearchingRestaurants(false);
        return;
      }

      try {
        setSearchingRestaurants(true);
        setAssociationError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error(
            "Necesitas una sesión activa para buscar restaurantes.",
          );
        }

        const response = await fetch(
          `/api/super-admin/restaurants/search?q=${encodeURIComponent(query)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          },
        );

        const result =
          (await response.json()) as RestaurantSearchResponse;

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              result.error ||
              "No pudimos buscar restaurantes.",
          );
        }

        if (!cancelled) {
          setRestaurantResults(result.restaurants ?? []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "[RESTAURANT REQUEST DETAIL] Error buscando restaurante:",
            error,
          );
          setRestaurantResults([]);
          setAssociationError(
            error instanceof Error
              ? error.message
              : "No pudimos buscar restaurantes.",
          );
        }
      } finally {
        if (!cancelled) {
          setSearchingRestaurants(false);
        }
      }
    };

    const timeout = window.setTimeout(
      () => void searchRestaurants(),
      250,
    );

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [restaurantSearch, restaurantId]);

  const requestAssociationConfirmation = () => {
    if (!selectedRestaurant || associatingRestaurant) {
      return;
    }

    setAssociationError("");
    setAssociationSuccess(false);
    setShowAssociationConfirm(true);
  };

  const associateRestaurant = async () => {
    if (!selectedRestaurant || associatingRestaurant) {
      return;
    }

    try {
      setAssociatingRestaurant(true);
      setAssociationError("");
      setAssociationSuccess(false);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "Necesitas una sesión activa para asociar el restaurante.",
        );
      }

      const response = await fetch(
        `/api/super-admin/restaurant-requests/${encodeURIComponent(
          request.id,
        )}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            restaurant_id: selectedRestaurant.id,
          }),
        },
      );

      const result = (await response.json()) as {
        success: boolean;
        request?: RestaurantRequestDetailData;
        error?: string;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            result.error ||
            "No pudimos asociar el restaurante.",
        );
      }

      setRestaurantId(selectedRestaurant.id);
      setRestaurantResults([]);
      setRestaurantSearch("");
      setAssociationSuccess(true);
      setShowAssociationConfirm(false);
    } catch (error) {
      console.error(
        "[RESTAURANT REQUEST DETAIL] Error asociando restaurante:",
        error,
      );

      setAssociationError(
        error instanceof Error
          ? error.message
          : "No pudimos asociar el restaurante.",
      );
      setShowAssociationConfirm(false);
    } finally {
      setAssociatingRestaurant(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35 transition hover:text-orange-300"
        >
          <ArrowLeft size={14} />
          Volver a solicitudes
        </button>

        <header className="mb-6 flex flex-col gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-orange-400/10 bg-orange-400/[0.06] text-sm font-bold text-orange-300">
              {request.restaurant_name
                .trim()
                .split(/\s+/)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? "")
                .join("") || "R"}
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <RestaurantRequestStatusBadge
                  status={request.request_status}
                />

                {hasRestaurant ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-emerald-300">
                    <CheckCircle2 size={11} />
                    Restaurante creado
                  </span>
                ) : null}
              </div>

              <h1 className="truncate text-xl font-semibold tracking-[-0.03em] sm:text-2xl">
                {request.restaurant_name}
              </h1>

              <p className="mt-1 text-xs text-white/35">
                Solicitud recibida el{" "}
                {formatDate(request.created_at)}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {hasRestaurant ? (
              <a
                href={`/super-admin/restaurants/${restaurantId}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.07] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-emerald-300 transition hover:bg-emerald-400/[0.11]"
              >
                Ver restaurante
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onCreateRestaurant}
                disabled={
                  creatingRestaurant ||
                  request.request_status === "cancelled"
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-[10px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creatingRestaurant ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                ) : (
                  <Store size={14} />
                )}

                {creatingRestaurant
                  ? "Abriendo creación..."
                  : "Crear restaurante"}
              </button>
            )}
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <div className="space-y-4">
            <SectionCard
              icon={<Store size={16} />}
              title="Información del restaurante"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Nombre"
                  value={request.restaurant_name}
                />

                <DetailItem
                  label="Plan solicitado"
                  value={getPlanLabel(request.plan)}
                />

                <DetailItem
                  label="ID de solicitud"
                  value={request.id}
                  copyable
                  copied={copied === request.id}
                  onCopy={() =>
                    void copyValue(
                      request.id,
                      setCopied,
                    )
                  }
                />

                <div className="min-w-0 sm:col-span-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
                    Restaurante asociado
                  </p>

                  {restaurantId ? (
                    <div className="mt-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.04] p-3">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-300/70">
                            Restaurant ID
                          </p>
                          <p className="mt-1 truncate font-mono text-[10px] text-white/65">
                            {restaurantId}
                          </p>
                          <p className="mt-2 text-[10px] text-emerald-200/55">
                            {associationSuccess
                              ? "Restaurante asociado correctamente."
                              : "Esta solicitud ya está vinculada a un restaurante."}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            void copyValue(
                              restaurantId,
                              setCopied,
                            )
                          }
                          title={
                            copied === restaurantId
                              ? "Copiado"
                              : "Copiar Restaurant ID"
                          }
                          aria-label="Copiar Restaurant ID"
                          className="shrink-0 rounded-md p-1.5 text-white/20 transition hover:bg-white/[0.05] hover:text-orange-300"
                        >
                          {copied === restaurantId ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[10px] leading-5 text-white/35">
                        El restaurante todavía no está asociado.
                        Puedes buscarlo por nombre o slug y asociarlo
                        desde aquí.
                      </p>

                      <div className="relative mt-3">
                        <Search
                          size={14}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                        />

                        <input
                          type="search"
                          value={restaurantSearch}
                          onChange={(event) =>
                            setRestaurantSearch(
                              event.target.value,
                            )
                          }
                          placeholder="Buscar por nombre o slug..."
                          className="h-10 w-full rounded-lg border border-white/[0.08] bg-black/20 pl-9 pr-9 text-xs text-white outline-none transition placeholder:text-white/20 focus:border-orange-400/30"
                        />

                        {searchingRestaurants ? (
                          <Loader2
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-orange-300"
                          />
                        ) : null}
                      </div>

                      {restaurantResults.length > 0 ? (
                        <div className="mt-2 overflow-hidden rounded-lg border border-white/[0.07] bg-[#111]">
                          {restaurantResults.map((restaurant) => (
                            <button
                              key={restaurant.id}
                              type="button"
                              onClick={() => {
                                setSelectedRestaurant(
                                  restaurant,
                                );
                                setRestaurantSearch(
                                  restaurant.name,
                                );
                                setRestaurantResults([]);
                                setAssociationError("");
                              }}
                              className="flex w-full items-start justify-between gap-3 border-b border-white/[0.05] px-3 py-3 text-left last:border-b-0 hover:bg-white/[0.04]"
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-xs font-semibold text-white/75">
                                  {restaurant.name}
                                </span>
                                <span className="mt-1 block truncate text-[10px] text-white/30">
                                  /{restaurant.slug}
                                </span>
                              </span>

                              <span className="shrink-0 font-mono text-[8px] text-white/20">
                                {restaurant.id}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {selectedRestaurant ? (
                        <div className="mt-3 rounded-lg border border-orange-400/15 bg-orange-400/[0.04] p-3">
                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-orange-300/60">
                            Restaurante seleccionado
                          </p>

                          <p className="mt-1 text-xs font-semibold text-white/75">
                            {selectedRestaurant.name}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-white/35">
                            /{selectedRestaurant.slug}
                          </p>

                          <p className="mt-2 truncate font-mono text-[9px] text-white/30">
                            {selectedRestaurant.id}
                          </p>

                          <button
                            type="button"
                            onClick={requestAssociationConfirmation}
                            disabled={associatingRestaurant}
                            className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-3 text-[9px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {associatingRestaurant ? (
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                            ) : (
                              <CheckCircle2 size={13} />
                            )}
                            Asociar restaurante
                          </button>
                        </div>
                      ) : null}

                      {associationError ? (
                        <p className="mt-2 text-[10px] leading-4 text-red-300/70">
                          {associationError}
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<UserRound size={16} />}
              title="Información del propietario"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Nombre"
                  value={request.owner_name}
                />

                <DetailItem
                  label="Usuario"
                  value={request.user_id}
                  copyable
                  copied={copied === request.user_id}
                  onCopy={() =>
                    void copyValue(
                      request.user_id,
                      setCopied,
                    )
                  }
                />

                <DetailItem
                  label="Correo electrónico"
                  value={request.owner_email}
                  icon={<Mail size={13} />}
                />

                <DetailItem
                  label="Teléfono"
                  value={
                    request.owner_phone ||
                    "No registrado"
                  }
                  icon={<Phone size={13} />}
                />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard
              icon={<CreditCard size={16} />}
              title="Suscripción y PayPal"
            >
              <div className="space-y-4">
                <StatusLine
                  label="Plan"
                  value={getPlanLabel(request.plan)}
                />

                <StatusLine
                  label="Pago"
                  value={getPaymentLabel(
                    request.payment_status,
                  )}
                />

                <StatusLine
                  label="Suscripción"
                  value={getSubscriptionLabel(
                    request.subscription_status,
                  )}
                />

                <div className="border-t border-white/[0.06] pt-4">
                  <DetailItem
                    label="PayPal Subscription ID"
                    value={
                      request.paypal_subscription_id ??
                      "No disponible"
                    }
                    mono
                    copyable={Boolean(
                      request.paypal_subscription_id,
                    )}
                    copied={
                      Boolean(
                        request.paypal_subscription_id,
                      ) &&
                      copied ===
                        request.paypal_subscription_id
                    }
                    onCopy={
                      request.paypal_subscription_id
                        ? () =>
                            void copyValue(
                              request.paypal_subscription_id!,
                              setCopied,
                            )
                        : undefined
                    }
                  />

                  <div className="mt-4">
                    <DetailItem
                      label="PayPal Plan ID"
                      value={
                        request.paypal_plan_id ??
                        "No disponible"
                      }
                      mono
                      copyable={Boolean(
                        request.paypal_plan_id,
                      )}
                      copied={
                        Boolean(request.paypal_plan_id) &&
                        copied === request.paypal_plan_id
                      }
                      onCopy={
                        request.paypal_plan_id
                          ? () =>
                              void copyValue(
                                request.paypal_plan_id!,
                                setCopied,
                              )
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              icon={<Building2 size={16} />}
              title="Estado de creación"
            >
              {hasRestaurant ? (
                <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.05] p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-emerald-200">
                        Restaurante creado
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-200/45">
                        La solicitud ya está vinculada al
                        restaurante correspondiente.
                      </p>

                      <p className="mt-3 truncate font-mono text-[9px] text-emerald-200/35">
                        {restaurantId}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-orange-400/10 bg-orange-400/[0.04] p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-orange-300"
                    />

                    <div>
                      <p className="text-sm font-semibold text-orange-200">
                        Pendiente de creación
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        Utiliza el Wizard existente para
                        completar los datos del restaurante.
                        Al finalizar se asociará automáticamente
                        a esta solicitud.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard
              icon={<Clock3Icon />}
              title="Actividad"
            >
              <div className="space-y-3">
                <StatusLine
                  label="Creada"
                  value={formatDate(
                    request.created_at,
                  )}
                />

                <StatusLine
                  label="Última actualización"
                  value={formatDate(
                    request.updated_at,
                  )}
                />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {showAssociationConfirm && selectedRestaurant ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="associate-restaurant-title"
            className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#151515] p-5 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="associate-restaurant-title"
                  className="text-sm font-semibold text-white/90"
                >
                  Confirmar asociación
                </h2>
                <p className="mt-2 text-xs leading-5 text-white/40">
                  ¿Estás seguro de que quieres asociar este restaurante
                  con esta solicitud?
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAssociationConfirm(false)
                }
                disabled={associatingRestaurant}
                aria-label="Cerrar"
                className="rounded-lg p-1.5 text-white/25 transition hover:bg-white/[0.05] hover:text-white/60"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
              <p className="text-xs font-semibold text-white/75">
                {selectedRestaurant.name}
              </p>
              <p className="mt-1 text-[10px] text-white/35">
                /{selectedRestaurant.slug}
              </p>
              <p className="mt-2 truncate font-mono text-[9px] text-white/25">
                {selectedRestaurant.id}
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setShowAssociationConfirm(false)
                }
                disabled={associatingRestaurant}
                className="h-10 rounded-lg border border-white/[0.08] px-4 text-[9px] font-bold uppercase tracking-[0.08em] text-white/45 transition hover:bg-white/[0.04] hover:text-white/70 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => void associateRestaurant()}
                disabled={associatingRestaurant}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 text-[9px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-orange-400 disabled:opacity-50"
              >
                {associatingRestaurant ? (
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                ) : null}
                Sí, asociar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function Clock3Icon() {
  return <Building2 size={16} />;
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
      <div className="mb-5 flex items-center gap-2.5 border-b border-white/[0.06] pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-orange-300">
          {icon}
        </div>

        <h2 className="text-xs font-semibold text-white/75">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

function DetailItem({
  label,
  value,
  icon,
  mono = false,
  copyable = false,
  copied = false,
  onCopy,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/25">
        {label}
      </p>

      <div className="mt-1.5 flex min-w-0 items-center gap-2">
        {icon ? (
          <span className="shrink-0 text-white/25">
            {icon}
          </span>
        ) : null}

        <p
          className={`min-w-0 truncate text-xs text-white/65 ${
            mono ? "font-mono text-[10px]" : ""
          }`}
        >
          {value}
        </p>

        {copyable && onCopy ? (
          <button
            type="button"
            onClick={onCopy}
            title={copied ? "Copiado" : "Copiar"}
            aria-label={
              copied
                ? `Copiado: ${label}`
                : `Copiar ${label}`
            }
            className="shrink-0 rounded-md p-1 text-white/20 transition hover:bg-white/[0.05] hover:text-orange-300"
          >
            {copied ? (
              <CheckCircle2 size={13} />
            ) : (
              <Copy size={13} />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function StatusLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3 last:border-b-0 last:pb-0">
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
        {label}
      </span>

      <span className="max-w-[65%] truncate text-right text-xs font-medium text-white/60">
        {value}
      </span>
    </div>
  );
  }