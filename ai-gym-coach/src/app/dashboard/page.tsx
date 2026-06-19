"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { PlanLoadingState } from "@/components/empty-plan-state";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { useWorkoutRealtime } from "@/hooks/use-workout-realtime";
import { createWorkoutSessions, getScheduledSession, toDateKey } from "@/lib/workout-schedule";
import { adjustAiPlan } from "@/lib/api";
import { useState } from "react";

export default function DashboardPage() {
  const { profile, plan, generatedPlan, hasSavedPlan, isLoading } = useFitnessPlan();
  const { logs } = useWorkoutRealtime();
  const [adjusting, setAdjusting] = useState(false);

  if (isLoading) {
    return <AppShell><PlanLoadingState /></AppShell>;
  }

  const sessions = createWorkoutSessions({ profile, plan, generatedPlan });
  const today = new Date();
  const todaySession = hasSavedPlan
    ? getScheduledSession(today, sessions, profile.gymDays, profile.trainingDays)
    : null;
  const todayLog = logs.find((log) => log.scheduledDate === toDateKey(today));
  const todayWorkout = hasSavedPlan ? todaySession?.name || "Ngày nghỉ" : null;
  const workouts = todaySession
    ? todaySession.exercises.map((exercise) => ({
      name: exercise.name,
      target: `${exercise.sets} sets x ${exercise.reps}`,
    }))
    : [];
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
      <div className="p-4 sm:p-6 lg:p-10">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              {generatedPlan ? "Plan AI cá nhân" : hasSavedPlan ? "Plan cá nhân" : "Chưa có plan"}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {hasSavedPlan
                ? `Tổng quan ${generatedPlan?.summary?.goal || plan.goalLabel.toLowerCase()}`
                : "Bắt đầu hành trình của bạn"}
            </h2>
            <p className="mt-2 max-w-2xl text-zinc-500">
              {hasSavedPlan
                ? generatedPlan?.summary?.strategy || plan.focus
                : "Các chỉ số sẽ xuất hiện sau khi bạn hoàn tất thông tin cơ thể và tạo plan."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {hasSavedPlan && <button type="button" disabled={adjusting} onClick={async () => { setAdjusting(true); try { await adjustAiPlan(); window.location.reload(); } finally { setAdjusting(false); } }} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium hover:bg-white/10 disabled:opacity-50">{adjusting ? "AI đang phân tích..." : "AI điều chỉnh plan"}</button>}
            <Link
              href="/onboarding"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
            >
              {hasSavedPlan ? "Sửa chỉ số" : "Nhập chỉ số"}
            </Link>
            <Link
              href="/nutrition"
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:scale-105"
            >
              Xem thực đơn
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:rounded-3xl sm:p-6"
            >
              <p className="text-sm text-zinc-500">{metric.title}</p>
              <h3 className="mt-3 text-3xl font-bold sm:text-4xl">{metric.value}</h3>
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

              {hasSavedPlan && todaySession && (
                <Link
                  href="/workout"
                  className="w-fit rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:scale-105"
                >
                  {todayLog?.completed ? "Xem lại buổi tập" : "Bắt đầu tập"}
                </Link>
              )}
            </div>

            {hasSavedPlan && todaySession ? (
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
            ) : !hasSavedPlan ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center">
                <p className="font-medium text-zinc-300">Chưa có buổi tập</p>
                <p className="mt-2 text-sm text-zinc-600">
                  AI sẽ tạo lịch tập sau khi bạn nhập đủ chỉ số.
                </p>
                <Link href="/onboarding" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10">
                  Nhập chỉ số ngay
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center">
                <p className="font-medium text-zinc-300">Hôm nay là ngày nghỉ</p>
                <p className="mt-2 text-sm text-zinc-600">Phục hồi, ngủ đủ và chuẩn bị cho buổi tập tiếp theo.</p>
                <Link href="/workout" className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10">Xem lịch tập</Link>
              </div>
            )}
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
