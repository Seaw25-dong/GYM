"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import { AppShell } from "@/components/app-nav";
import { EmptyPlanState, PlanLoadingState } from "@/components/empty-plan-state";
import { TermTooltip } from "@/components/term-tooltip";
import { useFitnessPlan } from "@/hooks/use-fitness-plan";
import { getNutritionLog, saveNutritionLog } from "@/lib/api";
import { toDateKey } from "@/lib/workout-schedule";
import { foodMarket } from "@/lib/food-market";

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

        <NutritionTracker plannedMeals={meals} targets={targets} />

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

function NutritionTracker({ plannedMeals, targets }) {
  const date = toDateKey(new Date());
  const [meals, setMeals] = useState(() => plannedMeals.map((meal, mealIndex) => ({ mealIndex, name: meal.name, completed: false, foods: meal.foods || [] })));
  const [query, setQuery] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(0);
  const [saving, setSaving] = useState(false);
  useEffect(() => { getNutritionLog(date).then((log) => { if (log.meals?.length) setMeals(log.meals); }).catch(() => {}); }, [date]);
  useEffect(() => {
    const foodName = new URLSearchParams(window.location.search).get("food");
    const frame = window.requestAnimationFrame(() => {
      if (foodName) setQuery(foodName);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const updateFood = (mealIndex, foodIndex, grams) => setMeals((current) => current.map((meal, i) => i === mealIndex ? { ...meal, foods: meal.foods.map((food, j) => j === foodIndex ? { ...food, grams: Number(grams) } : food) } : meal));
  const removeFood = (mealIndex, foodIndex) => setMeals((current) => current.map((meal, i) => i === mealIndex ? { ...meal, foods: meal.foods.filter((_, j) => j !== foodIndex) } : meal));
  const mealsWithMacros = meals.map((meal) => ({ ...meal, foods: meal.foods.map(enrichFood) }));
  const daily = sumMacros(mealsWithMacros.flatMap((meal) => meal.foods));
  const save = async () => { setSaving(true); try { const log = await saveNutritionLog(date, mealsWithMacros); setMeals(log.meals); } finally { setSaving(false); } };
  const alternatives = foodMarket.filter((food) => food.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 12);
  const addFood = (food) => {
    setMeals((current) => current.map((meal, index) => index === selectedMeal ? { ...meal, foods: [...meal.foods, { name: food.name, grams: 100 }] } : meal));
    setQuery("");
  };
  return <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-bold">Chỉnh thực đơn hôm nay</h2><p className="mt-1 text-sm text-zinc-500">Thêm, bỏ hoặc đổi gram; tổng dinh dưỡng tự cập nhật.</p></div><button onClick={save} disabled={saving} className="rounded-xl bg-white px-5 py-3 font-medium text-black">{saving ? "Đang lưu" : "Lưu thực đơn"}</button></div>

    <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{[["Calories", daily.calories, targets.calories, "kcal"],["Protein", daily.protein, targets.protein, "g"],["Carb", daily.carbs, targets.carbs, "g"],["Fat", daily.fat, targets.fat, "g"]].map(([label,value,target,unit]) => <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-3"><p className="text-xs text-zinc-600">{label}</p><strong className="mt-1 block text-xl">{Math.round(value)}{unit}</strong><p className="text-xs text-zinc-600">Mục tiêu {target}{unit}</p></div>)}<div className="col-span-2 rounded-2xl border border-white/10 bg-black/30 p-3 sm:col-span-1"><p className="text-xs text-zinc-600">Còn lại</p><strong className={daily.calories > targets.calories ? "text-red-400" : "text-emerald-400"}>{Math.round(targets.calories - daily.calories)} kcal</strong></div></div>

    <div className="mt-5 grid gap-4 lg:grid-cols-2">{mealsWithMacros.map((meal, mealIndex) => { const total = sumMacros(meal.foods); return <article key={mealIndex} className="rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between gap-3"><label className="flex items-center gap-3 font-semibold"><input type="checkbox" checked={meal.completed} onChange={(e) => setMeals((current) => current.map((item,i) => i === mealIndex ? { ...item, completed: e.target.checked } : item))} className="size-5 accent-white" />{meal.name}</label><span className="text-sm text-zinc-400">{Math.round(total.calories)} kcal · {Math.round(total.protein)}g P</span></div>
      <div className="mt-4 space-y-2">{meal.foods.map((food, foodIndex) => <div key={`${food.name}-${foodIndex}`} className="grid grid-cols-[1fr_78px_36px] items-center gap-2 rounded-xl border border-white/5 p-2 text-sm"><div><p className="text-zinc-300">{food.name}</p><p className="text-xs text-zinc-600">{Math.round(food.calories)} kcal · P {round(food.protein)} · C {round(food.carbs)} · F {round(food.fat)}</p></div><label className="relative"><input type="number" min="0" value={food.grams} onChange={(e) => updateFood(mealIndex, foodIndex, e.target.value)} className="w-full rounded-lg border border-white/10 bg-black py-2 pl-2 pr-5 text-right" /><span className="absolute right-1 top-2.5 text-xs text-zinc-600">g</span></label><button type="button" onClick={() => removeFood(mealIndex, foodIndex)} aria-label={`Bỏ ${food.name}`} className="grid size-9 place-items-center rounded-lg text-zinc-600 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="size-4" /></button></div>)}</div>
      <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs text-zinc-500"><span>{Math.round(total.calories)} kcal</span><span>{round(total.protein)}g P</span><span>{round(total.carbs)}g C</span><span>{round(total.fat)}g F</span></div>
    </article>; })}</div>

    <div className="mt-5 rounded-2xl border border-white/10 p-4"><div className="grid gap-3 sm:grid-cols-[200px_1fr]"><select value={selectedMeal} onChange={(e) => setSelectedMeal(Number(e.target.value))} className="rounded-xl border border-white/10 bg-black/40 p-3">{meals.map((meal,index) => <option key={index} value={index}>Thêm vào {meal.name}</option>)}</select><label className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-600" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm từ kho thực phẩm..." className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-3" /></label></div>{query && <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{alternatives.map((food) => <button key={food.name} type="button" onClick={() => addFood(food)} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-left text-sm hover:bg-white/5"><span>{food.name}<small className="mt-1 block text-zinc-600">{food.calories} kcal · {food.protein}g protein /100g</small></span><Plus className="size-4" /></button>)}</div>}</div>
  </section>;
}

function enrichFood(food) {
  const source = findFood(food.name);
  const ratio = (Number(food.grams) || 0) / 100;
  return { ...food, grams: Number(food.grams) || 0, calories: source ? source.calories * ratio : Number(food.calories) || 0, protein: source ? source.protein * ratio : Number(food.protein) || 0, carbs: source ? source.carbs * ratio : Number(food.carbs) || 0, fat: source ? source.fat * ratio : Number(food.fat) || 0 };
}

function findFood(name) {
  const normalized = String(name).toLowerCase();
  const aliases = { "cơm": "gạo trắng", "ức gà": "ức gà không da", "bò nạc": "thịt bò nạc", "cá trắng": "cá basa", "trứng": "trứng gà", "rau xanh": "rau bina", "salad": "rau bina", "pasta": "mì pasta", "berries": "dâu tây" };
  const target = aliases[normalized] || normalized;
  return foodMarket.find((food) => food.name.toLowerCase() === target || food.name.toLowerCase().includes(target) || target.includes(food.name.toLowerCase()));
}

function sumMacros(foods) {
  return foods.reduce((total, food) => ({ calories: total.calories + Number(food.calories || 0), protein: total.protein + Number(food.protein || 0), carbs: total.carbs + Number(food.carbs || 0), fat: total.fat + Number(food.fat || 0) }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function round(value) { return Math.round(Number(value) * 10) / 10; }
