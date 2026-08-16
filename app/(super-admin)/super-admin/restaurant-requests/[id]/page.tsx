"use client";

import {
  AlertCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import RestaurantRequestDetail, {
  type RestaurantRequestDetailData,
} from "@/components/super-admin/restaurant-requests/RestaurantRequestDetail";
import { supabase } from "@/lib/supabase/client";

type ApiResponse = {
  success: boolean;
  request?: RestaurantRequestDetailData;
  error?: string;
  message?: string;
};

export default function RestaurantRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const requestId = params?.id ?? "";

  const [request, setRequest] =
    useState<RestaurantRequestDetailData | null>(null);

  const [loading, setLoading] = useState(true);

  const [creatingRestaurant, setCreatingRestaurant] =
    useState(false);

  const [error, setError] = useState("");

  const loadRequest = useCallback(async () => {
    if (!requestId) {
      setError("Falta el identificador de la solicitud.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(
        `/api/super-admin/restaurant-requests/${encodeURIComponent(
          requestId,
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        },
      );

      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok || !result.success || !result.request) {
        throw new Error(
          result.message ||
            result.error ||
            "No pudimos cargar la solicitud.",
        );
      }

      setRequest(result.request);
    } catch (loadError) {
      console.error(
        "[SUPER ADMIN REQUEST DETAIL]",
        loadError,
      );

      setError(
        loadError instanceof Error
          ? loadError.message
          : "No pudimos cargar la solicitud.",
      );
    } finally {
      setLoading(false);
    }
  }, [requestId, router]);

  useEffect(() => {
    void loadRequest();
  }, [loadRequest]);

  const handleCreateRestaurant = () => {
    if (!request || request.restaurant_id) {
      return;
    }

    setCreatingRestaurant(true);

    const params = new URLSearchParams({
      restaurant_request_id: request.id,
    });

    if (request.plan) {
      params.set("plan", request.plan);
    }

    router.push(
      `/super-admin/restaurants/new?${params.toString()}`,
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-white">
        <div className="flex items-center gap-3 text-sm text-white/40">
          <Loader2
            size={18}
            className="animate-spin text-orange-300"
          />
          Cargando solicitud...
        </div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-300"
            />

            <div>
              <h1 className="text-sm font-semibold text-red-200">
                No pudimos cargar la solicitud
              </h1>

              <p className="mt-2 text-xs leading-5 text-red-200/50">
                {error ||
                  "La solicitud no existe o ya no está disponible."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/super-admin/restaurant-requests",
              )
            }
            className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-orange-300"
          >
            <ArrowLeft size={13} />
            Volver a solicitudes
          </button>
        </div>
      </main>
    );
  }

  return (
    <RestaurantRequestDetail
      request={request}
      creatingRestaurant={creatingRestaurant}
      onCreateRestaurant={handleCreateRestaurant}
      onBack={() =>
        router.push(
          "/super-admin/restaurant-requests",
        )
      }
    />
  );
}