"use client";

import { motion } from "framer-motion";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
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

export default function ProgressPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Analytics
          </p>

          <h1 className="mt-2 text-5xl font-bold tracking-tight">
            Progress Tracking
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Analyze strength progression, body composition,
            recovery and performance trends over time.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Current Weight", "76.4kg"],
            ["Bench PR", "85kg"],
            ["Body Fat", "15.8%"],
            ["Recovery Avg", "81%"],
          ].map(([title, value], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm text-zinc-500">
                {title}
              </p>

              <h2 className="mt-4 text-4xl font-bold">
                {value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-8 grid gap-8 xl:grid-cols-2">

          {/* Strength Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                Bench Progression
              </h3>

              <p className="mt-2 text-zinc-500">
                Estimated 1RM progression over 5 weeks
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                  />

                  <XAxis
                    dataKey="week"
                    stroke="#71717a"
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="bench"
                    stroke="#ffffff"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Weight Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold">
                Weight Trend
              </h3>

              <p className="mt-2 text-zinc-500">
                Body weight trend analysis
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                  />

                  <XAxis
                    dataKey="week"
                    stroke="#71717a"
                  />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#ffffff"
                    fill="#27272a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            AI Analysis
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight">
            Performance trending positively
          </h2>

          <div className="mt-6 grid gap-6 xl:grid-cols-3">

            {[
              {
                title: "Strength Increase",
                text: "Bench press strength improved 13.3% over the last 5 weeks.",
              },
              {
                title: "Recovery Trend",
                text: "Recovery score stabilized despite increased training volume.",
              },
              {
                title: "Fat Loss Progress",
                text: "Weight trend indicates sustainable fat loss pace.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <h3 className="text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-3 leading-relaxed text-zinc-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}