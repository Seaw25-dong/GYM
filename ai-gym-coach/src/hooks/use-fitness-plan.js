"use client";

import { useEffect, useState } from "react";

import { getCurrentFitnessPlan } from "@/lib/api";
import { calculateFitnessPlan, defaultProfile } from "@/lib/fitness";

function useFitnessPlan() {
  const [data, setData] = useState({
    profile: defaultProfile,
    plan: calculateFitnessPlan(defaultProfile),
    generatedPlan: null,
    hasSavedPlan: false,
    isLoading: true,
  });

  useEffect(() => {
    let active = true;

    getCurrentFitnessPlan()
      .then((result) => {
        if (!active) return;
        const profile = result.profile || defaultProfile;
        setData({
          profile,
          plan: result.calculatedPlan || calculateFitnessPlan(profile),
          generatedPlan: result.generatedPlan || null,
          hasSavedPlan: Boolean(result.profile),
          isLoading: false,
        });
      })
      .catch(() => {
        if (active) setData((current) => ({ ...current, isLoading: false }));
      });

    return () => {
      active = false;
    };
  }, []);

  return data;
}

export { useFitnessPlan };
