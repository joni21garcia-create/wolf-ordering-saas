"use client";

import {
  Bike,
  CheckCheck,
  CheckCircle2,
  ChefHat,
  Clock3,
} from "lucide-react";

import {
  WolfBadge,
} from "@/lib/wolf-ui";

export type WolfOrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export interface WolfStatusBadgeProps {

  status: WolfOrderStatus | string;

}

function getConfig(status: string) {

  switch (status) {

    case "accepted":

      return {

        label: "Esperando cocina",

        icon: Clock3,

        variant: "warning" as const,

      };

    case "preparing":

      return {

        label: "Preparando",

        icon: ChefHat,

        variant: "info" as const,

      };

    case "ready":

      return {

        label: "Listo",

        icon: CheckCircle2,

        variant: "success" as const,

      };

    case "out_for_delivery":

      return {

        label: "En camino",

        icon: Bike,

        variant: "orange" as const,

      };

    case "completed":

      return {

        label: "Completado",

        icon: CheckCheck,

        variant: "default" as const,

      };

    case "cancelled":

      return {

        label: "Cancelado",

        icon: CheckCheck,

        variant: "danger" as const,

      };

    default:

      return {

        label: "Pendiente",

        icon: Clock3,

        variant: "orange" as const,

      };

  }

}

export default function WolfStatusBadge({

  status,

}: WolfStatusBadgeProps) {

  const config = getConfig(status);

  const Icon = config.icon;

  return (

    <WolfBadge
      variant={config.variant}
    >

      <Icon size={12} />

      {config.label}

    </WolfBadge>

  );

}