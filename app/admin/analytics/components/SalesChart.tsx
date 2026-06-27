"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

export default function SalesChart({
  data,
}: any) {
  return (
    <ResponsiveContainer
      width="100%"
      height={350}
    >
      <AreaChart data={data}>
        <XAxis
          dataKey="day"
        />

        <Tooltip />

        <Area
          type="monotone"
          dataKey="sales"
          stroke="#f97316"
          fill="#f97316"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}