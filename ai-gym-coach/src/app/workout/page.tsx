"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { AppShell } from "@/components/app-nav";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

const exerciseTemplates = {
  push: [
    { name: "Bench Press", target: "4 sets · 6-8 reps" },
    { name: "Incline Dumbbell Press", target: "3 sets · 8-10 reps" },
    { name: "Cable Fly", target: "3 sets · 12-15 reps" },
  ],
  full: [
    { name: "Squat", target: "4 sets · 5-8 reps" },
    { name: "Dumbbell Press", target: "3 sets · 8-10 reps" },
    { name: "Cable Row", target: "3 sets · 10-12 reps" },
  ],
};

export default function WorkoutPage() {
  const { plan } = useFitnessPlan();
  const [logs, setLogs] = useState<Record<string, { weight: string; reps: string }>>({});
  const todayWorkout = plan.workoutSplit[0];
  const exercises = todayWorkout.includes("Full") ? exerciseTemplates.full : exerciseTemplates.push;

  const handleChange = (
    exercise: string,
    field: "weight" | "reps",
    value: string
  ) => {
    setLogs((prev) => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value,
      },
    }));
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">Today</p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight">{todayWorkout}</h1>
            <p className="mt-3 text-zinc-400">
              Programmed for {plan.goalLabel.toLowerCase()} · {plan.targetCalories} kcal target
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <p className="text-sm text-zinc-500">Estimated Duration</p>
            <h3 className="mt-1 text-2xl font-bold">60 min</h3>
          </div>
        </div>

        <div className="space-y-8">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{exercise.name}</h2>
                  <p className="mt-2 text-zinc-500">{exercise.target}</p>
                </div>

                <Link
                  href="/progress"
                  className="w-fit rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm transition hover:bg-white/10"
                >
                  View History
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div>
                  <label className="mb-2 block text-sm text-zinc-500">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    value={logs[exercise.name]?.weight || ""}
                    onChange={(event) => handleChange(exercise.name, "weight", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-500">Reps</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={logs[exercise.name]?.reps || ""}
                    onChange={(event) => handleChange(exercise.name, "reps", event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    className="w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.02]"
                  >
                    Complete Set
                  </button>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="mb-4 text-sm text-zinc-500">Previous Performance</p>
                <div className="flex flex-wrap gap-3">
                  {["75kg x 8", "75kg x 8", "80kg x 6"].map((set) => (
                    <div
                      key={set}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
                    >
                      {set}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex justify-end"
        >
          <Link
            href="/progress"
            className="rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105"
          >
            Finish Workout
          </Link>
        </motion.div>
      </div>
    </AppShell>
  );
}
