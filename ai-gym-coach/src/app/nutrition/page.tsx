"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app-nav";
import { EmptyPlanState, PlanLoadingState } from "@/components/empty-plan-state";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { getNutritionLog, saveNutritionLog } from "@/lib/api";
import { toDateKey } from "@/lib/workout-schedule";

export default function NutritionPage() {
  const { plan, generatedPlan, hasSavedPlan, isLoading } = useFitnessPlan();

  if (isLoading) {
    return <AppShell><PlanLoadingState /></AppShell>;
  }

  if (!hasSavedPlan) {
    return (
      <AppShell>
        <EmptyPlanState
          title="Chưa có kế hoạch dinh dưỡng"
          description="Sau khi bạn nhập chỉ số, AI sẽ tính calo, macro và gợi ý thực đơn cá nhân."
        />
      </AppShell>
    );
  }
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Dinh dưỡng
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
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

        <NutritionTracker plannedMeals={meals} />

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

function NutritionTracker({ plannedMeals }) {
  const date = toDateKey(new Date());
  const [meals, setMeals] = useState(() => plannedMeals.map((meal, mealIndex) => ({ mealIndex, name: meal.name, completed: false, foods: (meal.foods || []).map((food) => ({ ...food, calories: 0, protein: 0 })) })));
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { getNutritionLog(date).then((log) => { if (log.meals?.length) setMeals(log.meals); }).catch(() => {}); }, [date]);
  const updateFood = (mealIndex, foodIndex, grams) => setMeals((current) => current.map((meal, i) => i === mealIndex ? { ...meal, foods: meal.foods.map((food, j) => j === foodIndex ? { ...food, grams: Number(grams) } : food) } : meal));
  const save = async () => { setSaving(true); try { const log = await saveNutritionLog(date, meals); setMeals(log.meals); } finally { setSaving(false); } };
  const alternatives = ["Cơm", "Khoai lang", "Yến mạch", "Ức gà", "Cá", "Bò nạc", "Trứng", "Sữa chua Hy Lạp", "Đậu phụ", "Rau xanh"].filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  return <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Nhật ký ăn hôm nay</h2><p className="mt-1 text-sm text-zinc-500">Đánh dấu bữa và sửa gram thực tế.</p></div><button onClick={save} disabled={saving} className="rounded-xl bg-white px-5 py-3 font-medium text-black">{saving ? "Đang lưu" : "Lưu nhật ký"}</button></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2">{meals.map((meal, mealIndex) => <article key={mealIndex} className="rounded-2xl border border-white/10 bg-black/30 p-4"><label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={meal.completed} onChange={(e) => setMeals((current) => current.map((item,i) => i === mealIndex ? { ...item, completed: e.target.checked } : item))} className="size-5 accent-white" />{meal.name}</label><div className="mt-4 space-y-2">{meal.foods.map((food, foodIndex) => <div key={`${food.name}-${foodIndex}`} className="flex items-center justify-between gap-3 text-sm"><span className="text-zinc-400">{food.name}</span><input type="number" value={food.grams} onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)} className="w-24 rounded-lg border border-white/10 bg-black p-2 text-right" /></div>)}</div></article>)}</div>
    <div className="mt-5"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm thực phẩm thay thế..." className="w-full rounded-xl border border-white/10 bg-black/40 p-3" />{query && <div className="mt-2 flex flex-wrap gap-2">{alternatives.map((name) => <button key={name} type="button" onClick={() => { setMeals((current) => current.map((meal,i) => i === 0 ? { ...meal, foods: [...meal.foods, { name, grams: 100, calories: 0, protein: 0 }] } : meal)); setQuery(""); }} className="rounded-full border border-white/10 px-3 py-2 text-sm">+ {name}</button>)}</div>}</div>
  </section>;
}
