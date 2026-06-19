"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

function StrengthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#ffffff"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function WeightChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="date" stroke="#71717a" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#ffffff"
          fill="#27272a"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { StrengthChart, WeightChart };
