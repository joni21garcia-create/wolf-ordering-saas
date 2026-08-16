import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  HelpCircle,
  XCircle,
} from "lucide-react";

export type RestaurantRequestStatus =
  | "pending"
  | "in_review"
  | "completed"
  | "cancelled"
  | string;

type RestaurantRequestStatusBadgeProps = {
  status: RestaurantRequestStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
};

type StatusConfig = {
  label: string;
  icon: typeof Clock3;
  className: string;
};

function getStatusConfig(
  status: RestaurantRequestStatus,
): StatusConfig {
  switch (status) {
    case "pending":
      return {
        label: "Pendiente",
        icon: Clock3,
        className:
          "border-white/[0.08] bg-white/[0.045] text-white/60",
      };

    case "in_review":
      return {
        label: "En revisión",
        icon: AlertCircle,
        className:
          "border-orange-400/15 bg-orange-400/[0.07] text-orange-300",
      };

    case "completed":
      return {
        label: "Completada",
        icon: CheckCircle2,
        className:
          "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-300",
      };

    case "cancelled":
      return {
        label: "Cancelada",
        icon: XCircle,
        className:
          "border-red-400/15 bg-red-400/[0.07] text-red-300",
      };

    default:
      return {
        label: status || "Sin estado",
        icon: HelpCircle,
        className:
          "border-white/[0.08] bg-white/[0.035] text-white/40",
      };
  }
}

export default function RestaurantRequestStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: RestaurantRequestStatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[8px] gap-1"
      : "px-2.5 py-1 text-[9px] gap-1.5";

  const iconSize = size === "sm" ? 11 : 12;

  return (
    <span
      role="status"
      aria-label={`Estado: ${config.label}`}
      className={`inline-flex w-fit items-center rounded-full border font-bold uppercase tracking-[0.08em] ${sizeClasses} ${config.className}`}
    >
      {showIcon ? (
        <Icon
          size={iconSize}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      )}

      <span>{config.label}</span>
    </span>
  );
}