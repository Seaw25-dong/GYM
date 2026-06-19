"use client";

import { useEffect, useState } from "react";

import { calculateFitnessPlan, defaultProfile } from "@/lib/fitness";

function useFitnessPlan() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.requestAnimationFrame(() => setReady(true));
  }, []);

  const savedProfile =
    ready && typeof window !== "undefined"
      ? window.localStorage.getItem("ai-gym-profile")
      : null;
  const savedGeneratedPlan =
    ready && typeof window !== "undefined"
      ? window.localStorage.getItem("ai-gym-generated-plan")
      : null;
  const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  const plan = calculateFitnessPlan(profile);
  const generatedPlan = savedGeneratedPlan ? JSON.parse(savedGeneratedPlan) : null;
  const hasSavedPlan = Boolean(savedProfile);

  return { profile, plan, generatedPlan, hasSavedPlan };
}

export { useFitnessPlan };
