"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const steps = [
  "Body Metrics",
  "Goal",
  "Activity",
  "Experience",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-3xl">

        {/* Progress */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  i <= step
                    ? "bg-white"
                    : "bg-zinc-800"
                } ${i !== steps.length - 1 ? "mr-3" : ""}`}
              />
            ))}
          </div>

          <p className="text-sm text-zinc-500">
            Step {step + 1} of {steps.length}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <AnimatePresence mode="wait">

            {/* Step 1 */}
            {step === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h1 className="text-4xl font-bold">
                  Body Metrics
                </h1>

                <p className="mt-3 text-zinc-400">
                  Tell us about your current physique.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-2">

                  <input
                    placeholder="Age"
                    className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                  />

                  <input
                    placeholder="Height (cm)"
                    className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                  />

                  <input
                    placeholder="Weight (kg)"
                    className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                  />

                  <input
                    placeholder="Body Fat %"
                    className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h1 className="text-4xl font-bold">
                  Your Goal
                </h1>

                <p className="mt-3 text-zinc-400">
                  Select your primary objective.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-2">

                  {[
                    "Fat Loss",
                    "Lean Bulk",
                    "Build Muscle",
                    "Strength",
                  ].map((goal) => (
                    <button
                      key={goal}
                      className="rounded-3xl border border-white/10 bg-black/40 p-8 text-left transition hover:border-white/20 hover:bg-white/5"
                    >
                      <h3 className="text-2xl font-semibold">
                        {goal}
                      </h3>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h1 className="text-4xl font-bold">
                  Activity Level
                </h1>

                <p className="mt-3 text-zinc-400">
                  Help us estimate your recovery and calorie needs.
                </p>

                <div className="mt-10 space-y-4">

                  {[
                    "Sedentary",
                    "Lightly Active",
                    "Moderately Active",
                    "Very Active",
                  ].map((activity) => (
                    <button
                      key={activity}
                      className="w-full rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-left transition hover:border-white/20 hover:bg-white/5"
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 3 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h1 className="text-4xl font-bold">
                  Training Experience
                </h1>

                <p className="mt-3 text-zinc-400">
                  We’ll adapt your program accordingly.
                </p>

                <div className="mt-10 grid gap-5">

                  {[
                    "Beginner",
                    "Intermediate",
                    "Advanced",
                  ].map((level) => (
                    <button
                      key={level}
                      className="rounded-2xl border border-white/10 bg-black/40 px-6 py-5 text-left transition hover:border-white/20 hover:bg-white/5"
                    >
                      <h3 className="text-2xl font-semibold">
                        {level}
                      </h3>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Buttons */}
          <div className="mt-12 flex items-center justify-between">

            <button
              onClick={prevStep}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 transition hover:bg-white/10"
            >
              Back
            </button>

            {step === steps.length - 1 ? (
              <button className="rounded-2xl bg-white px-8 py-3 font-medium text-black transition hover:scale-105">
                Generate AI Plan
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="rounded-2xl bg-white px-8 py-3 font-medium text-black transition hover:scale-105"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}