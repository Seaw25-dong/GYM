"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-nav";
import { calculateFitnessPlan, defaultProfile } from "@/lib/fitness";
import { cn } from "@/lib/utils";

const steps = ["Body Metrics", "Goal", "Activity", "Plan Preview"];

const goals = [
  {
    value: "fat_loss",
    title: "Fat Loss",
    text: "Lower body fat while keeping muscle and gym performance.",
  },
  {
    value: "muscle_gain",
    title: "Muscle Gain",
    text: "Build lean mass with a controlled calorie surplus.",
  },
  {
    value: "recomp",
    title: "Recomposition",
    text: "Improve muscle definition near maintenance calories.",
  },
];

const activities = [
  { value: "sedentary", title: "Sedentary", text: "Desk work, little walking." },
  { value: "light", title: "Light", text: "Some walking and light movement." },
  { value: "moderate", title: "Moderate", text: "Active days and regular training." },
  { value: "very", title: "Very Active", text: "High daily movement or physical work." },
];

const experienceLevels = ["beginner", "intermediate", "advanced"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState(defaultProfile);
  const plan = useMemo(() => calculateFitnessPlan(profile), [profile]);

  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const savePlan = () => {
    window.localStorage.setItem("ai-gym-profile", JSON.stringify(profile));
    window.localStorage.setItem("ai-gym-plan", JSON.stringify(plan));
    router.push("/dashboard");
  };

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12 lg:min-h-screen">
        <div className="w-full max-w-5xl">
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              {steps.map((label, index) => (
                <div
                  key={label}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors",
                    index <= step ? "bg-white" : "bg-zinc-800"
                  )}
                />
              ))}
            </div>

            <p className="text-sm text-zinc-500">
              Step {step + 1} of {steps.length} · {steps[step]}
            </p>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="metrics"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <h1 className="text-4xl font-bold">Body Metrics</h1>
                  <p className="mt-3 text-zinc-400">
                    These numbers power your BMR, TDEE, calorie target and macro split.
                  </p>

                  <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <NumberInput label="Age" value={profile.age} onChange={(value) => updateProfile("age", value)} />
                    <SelectInput
                      label="Sex"
                      value={profile.sex}
                      options={[
                        ["male", "Male"],
                        ["female", "Female"],
                      ]}
                      onChange={(value) => updateProfile("sex", value)}
                    />
                    <NumberInput label="Height (cm)" value={profile.height} onChange={(value) => updateProfile("height", value)} />
                    <NumberInput label="Weight (kg)" value={profile.weight} onChange={(value) => updateProfile("weight", value)} />
                    <NumberInput label="Body Fat % (optional)" value={profile.bodyFat} onChange={(value) => updateProfile("bodyFat", value)} />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="goal"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <h1 className="text-4xl font-bold">Choose Your Goal</h1>
                  <p className="mt-3 text-zinc-400">
                    The app will adjust calories, macros and training emphasis from here.
                  </p>

                  <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {goals.map((goal) => (
                      <ChoiceCard
                        key={goal.value}
                        active={profile.goal === goal.value}
                        title={goal.title}
                        text={goal.text}
                        onClick={() => updateProfile("goal", goal.value)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <h1 className="text-4xl font-bold">Training Rhythm</h1>
                  <p className="mt-3 text-zinc-400">
                    Tell us how often you lift and play sport so TDEE is not guessed blindly.
                  </p>

                  <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="grid gap-4">
                      {activities.map((activity) => (
                        <ChoiceCard
                          key={activity.value}
                          active={profile.activity === activity.value}
                          title={activity.title}
                          text={activity.text}
                          onClick={() => updateProfile("activity", activity.value)}
                        />
                      ))}
                    </div>

                    <div className="grid content-start gap-5">
                      <NumberInput label="Gym sessions / week" value={profile.gymDays} onChange={(value) => updateProfile("gymDays", value)} />
                      <NumberInput label="Sport or cardio sessions / week" value={profile.sportDays} onChange={(value) => updateProfile("sportDays", value)} />
                      <SelectInput
                        label="Training experience"
                        value={profile.experience}
                        options={experienceLevels.map((level) => [level, capitalize(level)])}
                        onChange={(value) => updateProfile("experience", value)}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <h1 className="text-4xl font-bold">Your Starter Plan</h1>
                  <p className="mt-3 text-zinc-400">{plan.focus}</p>

                  <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    <PlanMetric title="BMR" value={`${plan.bmr} kcal`} />
                    <PlanMetric title="TDEE" value={`${plan.tdee} kcal`} />
                    <PlanMetric title="Target" value={`${plan.targetCalories} kcal`} />
                    <PlanMetric title="BMI" value={plan.bmi} />
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                      <p className="text-sm text-zinc-500">Daily macros</p>
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <PlanMetric title="Protein" value={`${plan.protein}g`} compact />
                        <PlanMetric title="Carbs" value={`${plan.carbs}g`} compact />
                        <PlanMetric title="Fat" value={`${plan.fat}g`} compact />
                      </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
                      <p className="text-sm text-zinc-500">Workout split</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {plan.workoutSplit.map((day, index) => (
                          <span
                            key={day}
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
                          >
                            Day {index + 1}: {day}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex items-center justify-between gap-4">
              {step === 0 ? (
                <Link
                  href="/"
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 transition hover:bg-white/10"
                >
                  Back Home
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 transition hover:bg-white/10"
                >
                  Back
                </button>
              )}

              {step === steps.length - 1 ? (
                <button
                  type="button"
                  onClick={savePlan}
                  className="rounded-2xl bg-white px-8 py-3 font-medium text-black transition hover:scale-105"
                >
                  Generate AI Plan
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-2xl bg-white px-8 py-3 font-medium text-black transition hover:scale-105"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/30"
      />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white/30"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChoiceCard({ active, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-3xl border p-6 text-left transition",
        active
          ? "border-white bg-white text-black"
          : "border-white/10 bg-black/40 text-white hover:border-white/20 hover:bg-white/5"
      )}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className={cn("mt-3 text-sm leading-relaxed", active ? "text-zinc-700" : "text-zinc-500")}>
        {text}
      </p>
    </button>
  );
}

function PlanMetric({ title, value, compact = false }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-black/30 p-5", compact && "p-4")}>
      <p className="text-sm text-zinc-500">{title}</p>
      <h2 className={cn("mt-2 font-bold", compact ? "text-2xl" : "text-3xl")}>{value}</h2>
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
