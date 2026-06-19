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

const strengthData = [
  { week: "W1", bench: 75 },
  { week: "W2", bench: 77.5 },
  { week: "W3", bench: 80 },
  { week: "W4", bench: 82.5 },
  { week: "W5", bench: 85 },
];

const weightData = [
  { week: "W1", weight: 78 },
  { week: "W2", weight: 77.6 },
  { week: "W3", weight: 77.2 },
  { week: "W4", weight: 76.8 },
  { week: "W5", weight: 76.4 },
];

function StrengthChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={strengthData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="week" stroke="#71717a" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="bench"
          stroke="#ffffff"
          strokeWidth={3}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function WeightChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={weightData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="week" stroke="#71717a" />
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
