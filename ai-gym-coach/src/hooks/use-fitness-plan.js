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
  const profile = savedProfile ? JSON.parse(savedProfile) : defaultProfile;
  const plan = calculateFitnessPlan(profile);
  const hasSavedPlan = Boolean(savedProfile);

  return { profile, plan, hasSavedPlan };
}

export { useFitnessPlan };
