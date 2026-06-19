const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

const goalSettings = {
  fat_loss: {
    label: "Fat Loss",
    calorieOffset: -500,
    proteinPerKg: 2.2,
    fatPerKg: 0.8,
    focus: "Preserve strength while creating a steady calorie deficit.",
  },
  muscle_gain: {
    label: "Muscle Gain",
    calorieOffset: 300,
    proteinPerKg: 2,
    fatPerKg: 0.9,
    focus: "Build muscle with a controlled surplus and progressive overload.",
  },
  recomp: {
    label: "Body Recomposition",
    calorieOffset: -100,
    proteinPerKg: 2.2,
    fatPerKg: 0.8,
    focus: "Improve body composition near maintenance with high protein.",
  },
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateBmr(profile) {
  const weight = toNumber(profile.weight);
  const height = toNumber(profile.height);
  const age = toNumber(profile.age);
  const sexOffset = profile.sex === "female" ? -161 : 5;

  return Math.round(10 * weight + 6.25 * height - 5 * age + sexOffset);
}

function calculateFitnessPlan(profile) {
  const weight = toNumber(profile.weight);
  const gymDays = toNumber(profile.gymDays);
  const sportDays = toNumber(profile.sportDays);
  const goal = goalSettings[profile.goal] || goalSettings.recomp;
  const multiplier = activityMultipliers[profile.activity] || activityMultipliers.light;
  const bmr = calculateBmr(profile);
  const exerciseAdjustment = Math.round((gymDays * 90 + sportDays * 70) / 7);
  const tdee = Math.round(bmr * multiplier + exerciseAdjustment);
  const targetCalories = Math.max(1200, tdee + goal.calorieOffset);
  const protein = Math.round(weight * goal.proteinPerKg);
  const fat = Math.round(weight * goal.fatPerKg);
  const carbs = Math.max(80, Math.round((targetCalories - protein * 4 - fat * 9) / 4));
  const bmi = Math.round((weight / (toNumber(profile.height) / 100) ** 2) * 10) / 10;

  return {
    bmi,
    bmr,
    tdee,
    targetCalories,
    protein,
    fat,
    carbs,
    goalLabel: goal.label,
    focus: goal.focus,
    workoutSplit: getWorkoutSplit(profile),
    mealPlan: getMealPlan(targetCalories, protein, profile.goal),
  };
}

function getWorkoutSplit(profile) {
  const gymDays = toNumber(profile.gymDays);
  const goal = profile.goal;

  if (gymDays <= 3) {
    return [
      "Full Body Strength",
      "Full Body Hypertrophy",
      goal === "fat_loss" ? "Full Body + Conditioning" : "Full Body Pump",
    ];
  }

  if (gymDays === 4) {
    return ["Upper Strength", "Lower Strength", "Upper Volume", "Lower Volume"];
  }

  return ["Push", "Pull", "Legs", "Upper Volume", "Lower + Conditioning"];
}

function getMealPlan(calories, protein, goal) {
  const isFatLoss = goal === "fat_loss";

  return [
    {
      name: "Breakfast",
      calories: Math.round(calories * 0.25),
      meal: isFatLoss
        ? "Greek yogurt, oats, berries, whey"
        : "Eggs, oats, banana, peanut butter",
    },
    {
      name: "Lunch",
      calories: Math.round(calories * 0.35),
      meal: "Chicken breast, rice, vegetables, olive oil",
    },
    {
      name: "Dinner",
      calories: Math.round(calories * 0.3),
      meal: isFatLoss
        ? "White fish, potatoes, salad"
        : "Lean beef, pasta, vegetables",
    },
    {
      name: "Snack",
      calories: Math.round(calories * 0.1),
      meal: `${Math.max(25, Math.round(protein * 0.18))}g protein snack`,
    },
  ];
}

const defaultProfile = {
  age: "25",
  sex: "male",
  height: "175",
  weight: "75",
  bodyFat: "15",
  activity: "light",
  gymDays: "4",
  sportDays: "1",
  experience: "intermediate",
  goal: "muscle_gain",
};

export { calculateFitnessPlan, defaultProfile, goalSettings };
