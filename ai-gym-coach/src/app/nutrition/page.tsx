"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

export default function NutritionPage() {
  const { plan } = useFitnessPlan();
  const macroTotal = plan.protein * 4 + plan.carbs * 4 + plan.fat * 9;
  const macroBars = [
    { label: "Protein", value: plan.protein * 4, text: `${plan.protein}g`, className: "bg-white" },
    { label: "Carbs", value: plan.carbs * 4, text: `${plan.carbs}g`, className: "bg-zinc-500" },
    { label: "Fat", value: plan.fat * 9, text: `${plan.fat}g`, className: "bg-zinc-700" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Nutrition
            </p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              {plan.targetCalories} kcal Meal Plan
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-400">
              A simple starting menu for {plan.goalLabel.toLowerCase()}.
              Adjust food choices, but keep calories and protein close.
            </p>
          </div>

          <Link
            href="/workout"
            className="w-fit rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
          >
            Go Train
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <p className="text-sm text-zinc-500">Macro Split</p>
            <div className="mt-5 flex h-4 overflow-hidden rounded-full bg-black/40">
              {macroBars.map((macro) => (
                <div
                  key={macro.label}
                  className={macro.className}
                  style={{ width: `${(macro.value / macroTotal) * 100}%` }}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              {macroBars.map((macro) => (
                <div
                  key={macro.label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <span className="text-zinc-400">{macro.label}</span>
                  <strong className="text-xl">{macro.text}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            {plan.mealPlan.map((meal, index) => (
              <motion.div
                key={meal.name}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">{meal.name}</h2>
                  <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-300">
                    {meal.calories} kcal
                  </span>
                </div>
                <p className="mt-5 leading-relaxed text-zinc-400">{meal.meal}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            Coaching Note
          </p>
          <h2 className="mt-4 text-3xl font-bold">Track the trend, not one meal.</h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            If body weight does not move after 14 days, adjust by 150-200 kcal.
            Keep protein stable first, then change carbs or fats based on training energy.
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}
