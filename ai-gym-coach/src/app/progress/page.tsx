"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

const StrengthChart = dynamic(
  () => import("@/components/progress-charts").then((mod) => mod.StrengthChart),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-2xl bg-black/20" />,
  }
);

const WeightChart = dynamic(
  () => import("@/components/progress-charts").then((mod) => mod.WeightChart),
  {
    ssr: false,
    loading: () => <div className="h-full rounded-2xl bg-black/20" />,
  }
);

export default function ProgressPage() {
  const { plan } = useFitnessPlan();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Analytics
            </p>

            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              Progress Tracking
            </h1>

            <p className="mt-4 max-w-2xl text-zinc-400">
              Track your {plan.goalLabel.toLowerCase()} trend against a {plan.targetCalories}
              kcal target and {plan.protein}g protein baseline.
            </p>
          </div>

          <Link
            href="/workout"
            className="w-fit rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
          >
            Log Next Workout
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Target Calories", `${plan.targetCalories}`],
            ["Bench PR", "85kg"],
            ["TDEE", `${plan.tdee}`],
            ["Protein", `${plan.protein}g`],
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

            <div className="h-[320px] min-w-0">
              <StrengthChart />
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

            <div className="h-[320px] min-w-0">
              <WeightChart />
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
    </AppShell>
  );
}
