"use client";

import {
  DollarSign,
  ShoppingBag,
  ChefHat,
  CheckCircle2,
  Wallet,
  Landmark,
} from "lucide-react";

import {
  cardStyle,
  colors,
} from "./styles";

import type {
  DashboardMetrics,
} from "./types";

interface Props {
  metrics: DashboardMetrics;
}

function MetricCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minHeight: 125,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            background: `${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
          }}
        >
          {icon}
        </div>
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: -.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function MetricsBar({
  metrics,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(210px,1fr))",
        gap: 18,
        marginBottom: 24,
      }}
    >
      <MetricCard
        title="Pendientes"
        value={metrics.pending}
        color={colors.orange}
        icon={<ShoppingBag size={20} />}
      />

      <MetricCard
        title="Preparación"
        value={metrics.preparing}
        color={colors.blue}
        icon={<ChefHat size={20} />}
      />

      <MetricCard
        title="Listos"
        value={metrics.ready}
        color={colors.green}
        icon={<CheckCircle2 size={20} />}
      />

      <MetricCard
        title="Ventas"
        value={`$ ${metrics.sales.toFixed(2)}`}
        color={colors.yellow}
        icon={<DollarSign size={20} />}
      />

      <MetricCard
        title="Wolf"
        value={`$ ${metrics.wolf.toFixed(2)}`}
        color="#8b5cf6"
        icon={<Landmark size={20} />}
      />

      <MetricCard
        title="Restaurante"
        value={`$ ${metrics.restaurant.toFixed(2)}`}
        color="#06b6d4"
        icon={<Wallet size={20} />}
      />
    </section>
  );
}