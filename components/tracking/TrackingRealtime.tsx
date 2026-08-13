"use client";

import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

export interface TrackingOrderUpdate {
  id: string;
  status?: string | null;
  [key: string]: unknown;
}

interface Props {
  orderId: string;
  onOrderUpdate: (order: TrackingOrderUpdate) => void;
  onConnectionChange?: (connected: boolean) => void;
}

/**
 * Realtime compartido para el tracking del cliente.
 *
 * Importante:
 * - NO recarga la página.
 * - Supabase Realtime entrega la fila actualizada.
 * - La UI recibe el cambio y decide cómo animarlo.
 */
export default function TrackingRealtime({
  orderId,
  onOrderUpdate,
  onConnectionChange,
}: Props) {
  useEffect(() => {
    if (!orderId) return;

    let mounted = true;

    console.log(
      "[TRACKING REALTIME] conectando pedido:",
      orderId
    );

    const channel = supabase
      .channel(`tracking-order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          if (!mounted) return;

          console.log(
            "[TRACKING REALTIME] UPDATE recibido:",
            payload
          );

          const nextOrder =
            payload.new as TrackingOrderUpdate;

          if (!nextOrder?.id) return;

          onOrderUpdate(nextOrder);
        }
      )
      .subscribe((status) => {
        if (!mounted) return;

        console.log(
          "[TRACKING REALTIME] status:",
          status
        );

        onConnectionChange?.(
          status === "SUBSCRIBED"
        );
      });

    return () => {
      mounted = false;
      onConnectionChange?.(false);
      void supabase.removeChannel(channel);
    };
  }, [
    orderId,
    onOrderUpdate,
    onConnectionChange,
  ]);

  return null;
}