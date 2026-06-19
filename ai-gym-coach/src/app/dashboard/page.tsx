"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

const exerciseLibrary = {
  Push: ["Bench Press", "Incline Dumbbell Press", "Cable Fly"],
  Pull: ["Lat Pulldown", "Seated Row", "Dumbbell Curl"],
  Legs: ["Squat", "Romanian Deadlift", "Leg Press"],
  "Full Body Strength": ["Squat", "Bench Press", "Lat Pulldown"],
  "Full Body Hypertrophy": ["Leg Press", "Dumbbell Press", "Cable Row"],
  "Full Body + Conditioning": ["Deadlift", "Push-up", "Bike Intervals"],
  "Full Body Pump": ["Goblet Squat", "Machine Press", "Cable Row"],
  "Upper Strength": ["Bench Press", "Weighted Row", "Overhead Press"],
  "Lower Strength": ["Squat", "Romanian Deadlift", "Calf Raise"],
  "Upper Volume": ["Incline Press", "Pulldown", "Lateral Raise"],
  "Lower Volume": ["Leg Press", "Leg Curl", "Walking Lunge"],
  "Lower + Conditioning": ["Front Squat", "Hip Thrust", "Sled Push"],
};

export default function DashboardPage() {
  const { profile, plan, hasSavedPlan } = useFitnessPlan();
  const todayWorkout = plan.workoutSplit[0];
  const workouts = exerciseLibrary[todayWorkout] || exerciseLibrary.Push;
  const metrics = [
    { title: "Target Calories", value: `${plan.targetCalories}`, detail: `${plan.goalLabel} target` },
    { title: "Protein", value: `${plan.protein}g`, detail: "Daily minimum" },
    { title: "TDEE", value: `${plan.tdee}`, detail: "Estimated maintenance" },
    { title: "Training", value: `${profile.gymDays}x`, detail: "Gym sessions / week" },
  ];

  return (
    <AppShell>
      <div className="p-6 lg:p-10">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              {hasSavedPlan ? "Personal plan" : "Demo plan"}
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              {plan.goalLabel} Dashboard
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-500">{plan.focus}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Edit Profile
            </Link>
            <Link
              href="/nutrition"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-105"
            >
              View Meal Plan
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p className="text-sm text-zinc-500">{metric.title}</p>
              <h3 className="mt-3 text-4xl font-bold">{metric.value}</h3>
              <p className="mt-2 text-sm text-zinc-500">{metric.detail}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold">Today&apos;s Workout</h3>
                <p className="mt-1 text-zinc-500">{todayWorkout}</p>
              </div>

              <Link
                href="/workout"
                className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-105"
              >
                Start Workout
              </Link>
            </div>

            <div className="space-y-4">
              {workouts.map((exercise, index) => (
                <div
                  key={exercise}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{exercise}</h4>
                    <p className="mt-1 text-sm text-zinc-500">
                      {index === 0 ? "4 sets · 6-8 reps" : "3 sets · 10-12 reps"}
                    </p>
                  </div>

                  <Link
                    href="/workout"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                  >
                    Log
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <p className="text-sm text-zinc-500">AI Nutrition Target</p>
            <h3 className="mt-4 text-3xl font-bold leading-tight">
              {plan.targetCalories} kcal with {plan.protein}g protein
            </h3>
            <p className="mt-4 text-zinc-400">
              Start by hitting protein and calories consistently. Carbs and fats can flex
              around training days as long as weekly adherence stays high.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                ["Carbs", `${plan.carbs}g`],
                ["Fat", `${plan.fat}g`],
                ["BMI", plan.bmi],
              ].map(([title, value]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">{title}</p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
