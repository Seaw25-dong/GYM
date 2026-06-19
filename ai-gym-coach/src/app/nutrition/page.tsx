"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AppShell } from "@/components/app-nav";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";

export default function NutritionPage() {
  const { plan, generatedPlan } = useFitnessPlan();
  const targets = generatedPlan?.nutritionPlan?.dailyTargets || {
    calories: plan.targetCalories,
    protein: plan.protein,
    carbs: plan.carbs,
    fat: plan.fat,
  };
  const meals = generatedPlan?.nutritionPlan?.meals || plan.mealPlan;
  const macroTotal = targets.protein * 4 + targets.carbs * 4 + targets.fat * 9;
  const macroBars = [
    { label: "Protein", value: targets.protein * 4, text: `${targets.protein}g`, className: "bg-white" },
    { label: "Carb", value: targets.carbs * 4, text: `${targets.carbs}g`, className: "bg-zinc-500" },
    { label: "Fat", value: targets.fat * 9, text: `${targets.fat}g`, className: "bg-zinc-700" },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Dinh dưỡng
            </p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight">
              Thực đơn {targets.calories} kcal
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-400">
              Mỗi bữa được tách theo gram từng thực phẩm để bạn dễ cân đo và thay thế.
            </p>
          </div>

          <Link
            href="/workout"
            className="w-fit rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:scale-105"
          >
            Xem lịch tập
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
          >
            <p className="text-sm text-zinc-500">
              <TermTooltip term="Macro">Tỉ lệ macro</TermTooltip>
            </p>
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
            {meals.map((meal, index) => (
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

                <div className="mt-5 grid gap-3">
                  {(meal.foods || []).map((food) => (
                    <div
                      key={`${meal.name}-${food.name}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3"
                    >
                      <span className="text-zinc-300">{food.name}</span>
                      <strong>{food.grams}g</strong>
                    </div>
                  ))}
                </div>

                {meal.note && (
                  <p className="mt-4 text-sm leading-relaxed text-zinc-500">{meal.note}</p>
                )}
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
            Ghi chú coach
          </p>
          <h2 className="mt-4 text-3xl font-bold">
            Theo dõi xu hướng, không phán xét một bữa.
          </h2>
          <p className="mt-4 max-w-3xl text-zinc-400">
            {generatedPlan?.nutritionPlan?.swapRules?.join(" ") ||
              "Nếu cân nặng không thay đổi sau 14 ngày, hãy điều chỉnh 150-200 kcal. Giữ protein ổn định trước, rồi thay đổi carb hoặc fat theo năng lượng khi tập."}
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}
