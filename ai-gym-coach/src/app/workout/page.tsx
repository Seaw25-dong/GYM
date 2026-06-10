"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const exercises = [
  {
    name: "Bench Press",
    target: "4 sets • 6-8 reps",
  },
  {
    name: "Incline Dumbbell Press",
    target: "3 sets • 10 reps",
  },
  {
    name: "Cable Fly",
    target: "3 sets • 12 reps",
  },
];

export default function WorkoutPage() {
  const [logs, setLogs] = useState<
    Record<string, { weight: string; reps: string }>
  >({});

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
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Today
            </p>

            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              Push Workout
            </h1>

            <p className="mt-3 text-zinc-400">
              Chest • Shoulders • Triceps
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <p className="text-sm text-zinc-500">
              Estimated Duration
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              65 min
            </h3>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-8">
          {exercises.map((exercise, index) => (
            <motion.div
              key={exercise.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              {/* Top */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold">
                    {exercise.name}
                  </h2>

                  <p className="mt-2 text-zinc-500">
                    {exercise.target}
                  </p>
                </div>

                <button className="rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm transition hover:bg-white/10">
                  View History
                </button>
              </div>

              {/* Inputs */}
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">

                {/* Weight */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-500">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    placeholder="80"
                    value={logs[exercise.name]?.weight || ""}
                    onChange={(e) =>
                      handleChange(
                        exercise.name,
                        "weight",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                {/* Reps */}
                <div>
                  <label className="mb-2 block text-sm text-zinc-500">
                    Reps
                  </label>

                  <input
                    type="number"
                    placeholder="8"
                    value={logs[exercise.name]?.reps || ""}
                    onChange={(e) =>
                      handleChange(
                        exercise.name,
                        "reps",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/20"
                  />
                </div>

                {/* Button */}
                <div className="flex items-end">
                  <button className="w-full rounded-2xl bg-white px-6 py-4 font-medium text-black transition hover:scale-[1.02]">
                    Complete Set
                  </button>
                </div>
              </div>

              {/* Previous Sets */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="mb-4 text-sm text-zinc-500">
                  Previous Performance
                </p>

                <div className="flex flex-wrap gap-3">
                  {[
                    "75kg × 8",
                    "75kg × 8",
                    "80kg × 6",
                  ].map((set, i) => (
                    <div
                      key={i}
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

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex justify-end"
        >
          <button className="rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:scale-105">
            Finish Workout
          </button>
        </motion.div>
      </div>
    </main>
  );
}