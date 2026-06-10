"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    title: "Calories",
    value: "2480",
  },
  {
    title: "Protein",
    value: "182g",
  },
  {
    title: "Recovery",
    value: "82%",
  },
  {
    title: "Workout Streak",
    value: "14 days",
  },
];

const workouts = [
  {
    name: "Bench Press",
    sets: "4 sets",
    reps: "6-8 reps",
  },
  {
    name: "Incline Dumbbell Press",
    sets: "3 sets",
    reps: "10 reps",
  },
  {
    name: "Cable Fly",
    sets: "3 sets",
    reps: "12 reps",
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden min-h-screen w-72 border-r border-white/10 bg-white/[0.02] p-6 lg:block">
          <div className="mb-10">
            <h1 className="text-2xl font-bold">AI Gym Coach</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Adaptive AI Training
            </p>
          </div>

          <nav className="space-y-3">
            {[
              "Dashboard",
              "Workout",
              "Progress",
              "Nutrition",
              "AI Coach",
              "Settings",
            ].map((item) => (
              <button
                key={item}
                className="w-full rounded-2xl border border-transparent px-4 py-3 text-left text-zinc-400 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-10">

          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">
                Dashboard
              </h2>

              <p className="mt-2 text-zinc-500">
                Track your recovery, performance and progression.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
              <p className="text-sm text-zinc-500">Today</p>
              <h3 className="text-lg font-semibold">Push Day</h3>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <p className="text-sm text-zinc-500">
                  {metric.title}
                </p>

                <h3 className="mt-3 text-4xl font-bold">
                  {metric.value}
                </h3>
              </motion.div>
            ))}
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">

            {/* Workout */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    Today's Workout
                  </h3>

                  <p className="mt-1 text-zinc-500">
                    Chest + Triceps
                  </p>
                </div>

                <button className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                  Start Workout
                </button>
              </div>

              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div
                    key={workout.name}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                  >
                    <div>
                      <h4 className="text-lg font-semibold">
                        {workout.name}
                      </h4>

                      <p className="mt-1 text-sm text-zinc-500">
                        {workout.sets} • {workout.reps}
                      </p>
                    </div>

                    <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10">
                      Log
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Insight */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm text-zinc-500">
                AI Insight
              </p>

              <h3 className="mt-4 text-3xl font-bold leading-tight">
                Recovery slightly reduced
              </h3>

              <p className="mt-4 text-zinc-400">
                Your training volume increased 18% this week
                while sleep duration decreased by 1.2 hours.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
                <p className="text-sm text-zinc-500">
                  Recommendation
                </p>

                <p className="mt-2 leading-relaxed text-zinc-300">
                  Consider reducing intensity by 10–15% tomorrow
                  or increasing sleep duration for better recovery.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}