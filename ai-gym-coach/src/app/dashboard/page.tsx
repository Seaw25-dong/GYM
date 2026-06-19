"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { fallbackWorkoutExercises } from "@/lib/exercise-library";

export default function DashboardPage() {
  const { profile, plan, generatedPlan, hasSavedPlan } = useFitnessPlan();
  const todayWorkout = generatedPlan?.workoutPlan?.[0]?.name || plan.workoutSplit[0];
  const workouts =
    generatedPlan?.workoutPlan?.[0]?.exercises?.map((exercise) => ({
      name: exercise.name,
      target: `${exercise.sets} sets x ${exercise.reps}`,
    })) ||
    fallbackWorkoutExercises.map((exercise) => ({
      name: exercise.name,
      target: `${exercise.sets} sets x ${exercise.reps}`,
    }));
  const metrics = [
    {
      id: "target",
      title: "Calo mục tiêu",
      value: `${plan.targetCalories}`,
      detail: `Mục tiêu ${plan.goalLabel.toLowerCase()}`,
    },
    {
      id: "protein",
      title: "Protein",
      value: `${plan.protein}g`,
      detail: "Tối thiểu mỗi ngày",
    },
    {
      id: "tdee",
      title: <TermTooltip term="TDEE" />,
      value: `${plan.tdee}`,
      detail: "Mức duy trì ước tính",
    },
    {
      id: "training",
      title: "Tập luyện",
      value: `${profile.gymDays}x`,
      detail: "Buổi gym / tuần",
    },
  ];

  return (
    <AppShell>
      <div className="p-6 lg:p-10">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              {generatedPlan ? "Plan AI cá nhân" : hasSavedPlan ? "Plan cá nhân" : "Plan mẫu"}
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              Tổng quan {generatedPlan?.summary?.goal || plan.goalLabel.toLowerCase()}
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-500">
              {generatedPlan?.summary?.strategy || plan.focus}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/onboarding"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              Sửa chỉ số
            </Link>
            <Link
              href="/nutrition"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-105"
            >
              Xem thực đơn
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
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
                <h3 className="text-2xl font-bold">Buổi tập hôm nay</h3>
                <p className="mt-1 text-zinc-500">{todayWorkout}</p>
              </div>

              <Link
                href="/workout"
                className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-105"
              >
                Bắt đầu tập
              </Link>
            </div>

            <div className="space-y-4">
              {workouts.map((exercise) => (
                <div
                  key={exercise.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-5"
                >
                  <div>
                    <h4 className="text-lg font-semibold">{exercise.name}</h4>
                    <p className="mt-1 text-sm text-zinc-500">{exercise.target}</p>
                  </div>

                  <Link
                    href="/workout"
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
                  >
                    Ghi log
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
            <p className="text-sm text-zinc-500">Mục tiêu dinh dưỡng</p>
            <h3 className="mt-4 text-3xl font-bold leading-tight">
              {generatedPlan?.summary?.calorieTarget ||
                `${plan.targetCalories} kcal với ${plan.protein}g protein`}
            </h3>
            <p className="mt-4 text-zinc-400">
              {generatedPlan?.summary?.macroTarget ||
                "Ưu tiên giữ đều protein và tổng calo trước. Carb và fat có thể linh hoạt theo ngày tập."}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { id: "carb", title: "Carb", value: `${plan.carbs}g` },
                { id: "fat", title: "Fat", value: `${plan.fat}g` },
                { id: "bmi", title: <TermTooltip term="BMI" />, value: plan.bmi },
              ].map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
