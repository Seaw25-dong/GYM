"use client";

import { motion } from "framer-motion";
import { Clock, Dumbbell, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-nav";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { fallbackWorkoutExercises } from "@/lib/exercise-library";

const dayNames = ["Thu 2", "Thu 3", "Thu 4", "Thu 5", "Thu 6", "Thu 7", "CN"];

export default function WorkoutPage() {
  const { profile, plan, generatedPlan } = useFitnessPlan();
  const sessions = useMemo(
    () => buildSessions({ profile, plan, generatedPlan }),
    [profile, plan, generatedPlan]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedSession = sessions[selectedIndex] || sessions[0] || createFallbackSession();

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Lich tap
            </p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              {Math.max(1, Number(profile.gymDays) || 1)} buoi / tuan
            </h1>
            <p className="mt-4 max-w-3xl text-zinc-400">
              Bam vao tung buoi de xem chi tiet bai tap, so sets, reps, thoi gian nghi va ghi chu ky thuat.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <p className="text-sm text-zinc-500">Nguon plan</p>
            <h3 className="mt-1 text-2xl font-bold">
              {generatedPlan ? "AI generated" : "Rule-based"}
            </h3>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="grid gap-4">
            {sessions.map((session, index) => (
              <button
                key={`${session.dayName}-${session.name}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`rounded-3xl border p-5 text-left transition ${
                  selectedIndex === index
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className={selectedIndex === index ? "text-zinc-600" : "text-zinc-500"}>
                      {session.dayName}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold">{session.name}</h2>
                  </div>
                  <span className="rounded-full border border-current/15 px-3 py-1 text-sm">
                    {session.exercises.length} bai
                  </span>
                </div>
              </button>
            ))}
          </div>

          <motion.section
            key={selectedSession.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-zinc-500">
                  {selectedSession.dayName}
                </p>
                <h2 className="mt-2 text-4xl font-bold">{selectedSession.name}</h2>
                <p className="mt-3 text-zinc-400">{selectedSession.focus}</p>
              </div>
              <div className="flex gap-3 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
                  <Clock className="size-4" />
                  60-75 phut
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2">
                  <Dumbbell className="size-4" />
                  {selectedSession.exercises.length} bai
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {selectedSession.exercises.map((exercise, index) => (
                <article
                  key={`${exercise.name}-${index}`}
                  className="grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-5 md:grid-cols-[120px_1fr]"
                >
                  <div className="flex aspect-video items-center justify-center rounded-2xl bg-white/5 md:aspect-square">
                    <PlayCircle className="size-8 text-zinc-500" />
                  </div>
                  <div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{exercise.name}</h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {exercise.muscleGroup || "Nhom co chinh"}
                        </p>
                      </div>
                      <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                        {exercise.sets} sets x {exercise.reps}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-zinc-500">
                      Nghi {exercise.restSeconds || 90}s giua cac set
                    </p>
                    <p className="mt-3 leading-relaxed text-zinc-400">{exercise.note}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </AppShell>
  );
}

function buildSessions({ profile, plan, generatedPlan }) {
  const aiSessions = generatedPlan?.workoutPlan;

  if (aiSessions?.length) {
    return aiSessions.map((session, index) => ({
      dayName: dayNames[index % dayNames.length],
      name: session.name || `Buoi ${index + 1}`,
      focus: session.focus || "Buoi tap AI generated.",
      exercises: session.exercises?.length ? session.exercises : fallbackWorkoutExercises,
    }));
  }

  const requestedDays = Number(profile.gymDays);
  const trainingDays = Math.max(
    1,
    Number.isFinite(requestedDays) ? requestedDays : plan.workoutSplit.length || 1
  );
  const split = plan.workoutSplit.length ? plan.workoutSplit : ["Full Body Strength"];

  return split.slice(0, trainingDays).map((name, index) => ({
    dayName: dayNames[index % dayNames.length],
    name,
    focus: "Buoi tap nen tang theo muc tieu hien tai.",
    exercises: fallbackWorkoutExercises,
  }));
}

function createFallbackSession() {
  return {
    dayName: "Thu 2",
    name: "Full Body Strength",
    focus: "Buoi tap nen tang theo muc tieu hien tai.",
    exercises: fallbackWorkoutExercises,
  };
}
